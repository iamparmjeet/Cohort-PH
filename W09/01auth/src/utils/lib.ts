import crypto from "crypto"
import nodemailer from "nodemailer";

import env from "./env";
import type { UserInputType } from "./types";

export const transport = nodemailer.createTransport({
  host: env.MAILTRAP_HOST,
  port: env.MAILTRAP_PORT,
  auth: {
    user: env.MAILTRAP_AUTH_USER,
    pass: env.MAILTRAP_AUTH_PASS,
  },
});

export function generateToken() {
  const token = crypto.randomBytes(32).toString("hex");
  return token
}


export async function sendEmailWithVerificationToken(user:UserInputType) {
  const token = generateToken()
  const verificationLink = `${env.SITE_URL}/api/v1/users/verify/${token}`
    const mailOptions = await transport.sendMail({
      from: "Parm <parm@example.com>",
      to: user.email || "",
      subject: "Verify your email",
      text: `Please click on the following link to verify:
        ${verificationLink}
      `,
      html: `<p>Hello ${user.name},</p>
          <p>Please verify your email by clicking the link below:</p>
          <a href="${verificationLink}">Verfication Link</a>`,
    });
  
  console.log("Message sent:", mailOptions);
  const sendMail = await transport.sendMail(mailOptions)
  console.log('Sendmail', sendMail)
  return sendMail
}




