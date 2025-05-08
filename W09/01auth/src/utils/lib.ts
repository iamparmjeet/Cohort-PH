import nodemailer from "nodemailer";

import env from "./env";

export const transport = nodemailer.createTransport({
  host: env.MAILTRAP_HOST,
  port: env.MAILTRAP_PORT,
  auth: {
    user: env.MAILTRAP_AUTH_USER,
    pass: env.MAILTRAP_AUTH_PASS,
  },
});
