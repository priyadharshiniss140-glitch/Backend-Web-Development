// Mock API for the lesson. No backend is required.
const usedTitles = new Set(["Welcome to Threadbase"]);

export function createThread({ title }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const trimmed = (title || "").trim();

      if (!trimmed) {
        reject({ response: { data: { message: "Title is required" } } });
      } else if (usedTitles.has(trimmed)) {
        reject({
          response: {
            data: { message: "A thread with this title already exists" },
          },
        });
      } else {
        usedTitles.add(trimmed);
        resolve({ data: { id: crypto.randomUUID(), title: trimmed } });
      }
    }, 500);
  });
}

export function login({ username, password }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === "ada" && password === "password") {
        resolve({ data: { token: "fake-jwt-token" } });
      } else {
        reject({
          response: { data: { message: "Invalid username or password" } },
        });
      }
    }, 500);
  });
}
