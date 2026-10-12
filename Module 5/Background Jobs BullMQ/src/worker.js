'use strict';

const { Worker } = require('bullmq');
const { connection } = require('./queue');
const { transporter } = require('./email');

const worker = new Worker(
  'email',
  async (job) => {
    if (job.name !== 'otp') {
      throw new Error(`Unsupported email job: ${job.name}`);
    }

    const { to, otp } = job.data || {};
    if (!to || !otp) {
      throw new Error('OTP email job requires both recipient and OTP');
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@aurora-profiles.dev',
      to,
      subject: 'Your email verification code',
      text: `Your verification code is ${otp}. It expires in 10 minutes.`,
      html: `<p>Your verification code is <strong>${otp}</strong>.</p><p>It expires in 10 minutes.</p>`,
    });
  },
  {
    connection,
  },
);

worker.on('completed', (job) => {
  console.log(`Email job ${job.id} completed`);
});

worker.on('failed', (job, error) => {
  console.error(`Email job ${job?.id ?? 'unknown'} failed:`, error.message);
});

module.exports = { worker };
