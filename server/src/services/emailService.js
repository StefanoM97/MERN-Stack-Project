import nodemailer from "nodemailer";
import { env } from "../config/env.js";

function isConfigured() {
  return Boolean(env.smtp.host && env.smtp.user && env.smtp.pass);
}

function createTransporter() {
  return nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure,
    auth: { user: env.smtp.user, pass: env.smtp.pass }
  });
}

async function send({ to, subject, text, html, previewUrl }) {
  if (!isConfigured()) {
  if (!env.isTest) {
    console.log(`\n[DEVELOPMENT EMAIL]\nTo: ${to}\nSubject: ${subject}\n${text}\n`);
  }

  return { developmentPreview: true, previewUrl };
}
  await createTransporter().sendMail({
    from: env.smtp.from,
    to,
    subject,
    text,
    html
  });
  return { developmentPreview: false };
}

export function sendVerificationEmail(user, rawToken) {
  const url = `${env.appUrl}/verify-email?token=${encodeURIComponent(rawToken)}`;
  return send({
    to: user.email,
    subject: "Verify your ReuseHub email",
    text: `Verify your email: ${url}`,
    html: `<p>Verify your ReuseHub account:</p><p><a href="${url}">${url}</a></p>`,
    previewUrl: url
  });
}

export function sendPasswordResetEmail(user, rawToken) {
  const url = `${env.appUrl}/reset-password?token=${encodeURIComponent(rawToken)}`;
  return send({
    to: user.email,
    subject: "Reset your ReuseHub password",
    text: `Reset your password: ${url}`,
    html: `<p>Reset your ReuseHub password:</p><p><a href="${url}">${url}</a></p>`,
    previewUrl: url
  });
}
