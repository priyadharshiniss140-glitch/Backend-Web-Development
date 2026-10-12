const DEFAULT_AVATAR = {
  url: 'https://cdn.aurora-profiles.dev/avatars/default.png',
  initials: '?',
  source: 'fallback',
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isRetryable(error) {
  if (!error) return true;

  // AbortController timeout signals use AbortError.
  if (error.name === 'AbortError') return true;

  // HTTP-like errors expose a status. Retry rate limits and server errors only.
  const status = error.status ?? error.response?.status;
  if (status === undefined || status === null) return true;
  if (status === 429) return true;
  return status >= 500 && status <= 599;
}

async function withTimeout(operation, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // Race against timeout as well as aborting the underlying operation:
    // not every operation observes AbortSignal correctly.
    const timeoutError = new Error('Operation timed out');
    timeoutError.name = 'AbortError';

    return await Promise.race([
      Promise.resolve().then(() => operation(controller.signal)),
      new Promise((_, reject) => {
        const onAbort = () => reject(timeoutError);
        if (controller.signal.aborted) {
          onAbort();
        } else {
          controller.signal.addEventListener('abort', onAbort, { once: true });
        }
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

async function withRetry(operation, options = {}) {
  const maxAttempts = options.maxAttempts ?? 3;
  const baseDelayMs = options.baseDelayMs ?? 25;

  let lastError;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const hasMoreAttempts = attempt + 1 < maxAttempts;

      if (!hasMoreAttempts || !isRetryable(error)) {
        throw error;
      }

      await sleep(baseDelayMs * 2 ** attempt);
    }
  }

  throw lastError;
}

async function getProfileWithAvatar(authorId, avatarClient, options = {}) {
  const timeoutMs = options.timeoutMs ?? 200;
  const maxAttempts = options.maxAttempts ?? 3;
  const baseDelayMs = options.baseDelayMs ?? 25;

  try {
    const avatar = await withRetry(
      () => withTimeout(
        signal => avatarClient.getAvatar(authorId, { signal }),
        timeoutMs,
      ),
      { maxAttempts, baseDelayMs },
    );

    return { authorId, avatar, degraded: false };
  } catch (error) {
    // Avatar is optional: a failed dependency must not break profile loading.
    return { authorId, avatar: DEFAULT_AVATAR, degraded: true };
  }
}

module.exports = {
  DEFAULT_AVATAR,
  sleep,
  isRetryable,
  withTimeout,
  withRetry,
  getProfileWithAvatar,
};
