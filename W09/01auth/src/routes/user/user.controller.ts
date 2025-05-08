/* eslint-disable no-console */
import type { Request, Response } from "express";

import crypto from "node:crypto";

import User from "@/db/user.model";
import env from "@/utils/env";
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, OK } from "@/utils/http-status-codes";
import { transport } from "@/utils/lib";



export async function registerUser(req: Request, res: Response) {
  // get data
  // validate
  // check if user already exits
  // create a user in db if not exits
  // create a verification token
  // save token in db
  // send token as email to user
  // send success status to user

  // get data
  const { name, email, password } = req.body || {};
  // validate
  if (!name || !email || !password) {
    res.status(BAD_REQUEST).json({
      message: BAD_REQUEST,
    });
    return
  }

  // find in DB
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(BAD_REQUEST).json({
        message: "User already exists",
      });
      return
    }

    // create a new user
    const user = await User.create({ name, email, password });

    if (!user) {
      res.status(BAD_REQUEST).json({
        message: "Unable to register user",
      });
      return
    }

    console.log("user", user);

    // token
    const token = crypto.randomBytes(32).toString("hex");
    console.log("token", token);

    // save the token in db
    user.verificationToken = token;
    await user.save();

    const verificationLink = `${env.SITE_URL}/api/v1/users/verify/${token}`
    // email
    const mailOptions = await transport.sendMail({
        from: "Parm <parm@example.com>",
        to: user.email || "",
        subject: "Verify your email",
        text: `Please click on the following link to verify:
          ${verificationLink}
        `,
        html: `<p>Hello ${user.name},</p>
            <p>Please verify your email by clicking the link below:</p>
            <a href="${verificationLink}">${verificationLink}</a>`,
      });

    console.log("Message sent:", mailOptions);
    const sendMail = await transport.sendMail(mailOptions)
    console.log("Sendmail", sendMail)
    
    res.status(CREATED).json({
      message: "User Register successfully. Please verify your email."
    })
    return
  }
  catch (error) {
    console.error("Registration error:", error);
    res.status(INTERNAL_SERVER_ERROR).json({
      message: "An error occured during registration"
    })
    return
  }
}

export async function verifyUser(req: Request, res: Response) {
  // get the token from params (url)
  // validate token
  // check token based on token in db
  // if not
  // if match - setVerified true
  // remove verificationtoken from db
  // save and return response

  // getting the token
  try {
    const {token} = req.params
    console.log("token", token)
    if (!token) {
      res.status(BAD_REQUEST).json({
        message: "Invalid token"
      })
      return
    }
  
    const user = await User.findOne({ verificationToken: token })
    if (!user) {
      res.status(BAD_REQUEST).json({
        message: "Invalid token"
      })
      return
    }
    console.log("user1", user)
    user.isVerified = true
    console.log("user1", user)
    user.verificationToken = undefined
    console.log("user1", user)

    await user.save()

    res.status(OK).json({
      message: "Verfication success"
    })
    return
    
  } catch (error) {
    console.error("Verfication error:", error);
    res.status(INTERNAL_SERVER_ERROR).json({
      message: "An error occured during Verfication"
    })
    return
  }


}
