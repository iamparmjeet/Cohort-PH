/* eslint-disable no-console */
import type { Request, Response } from "express";
import jwt from "jsonwebtoken"

import User from "@/db/user.model";
import env from "@/utils/env";
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, METHOD_NOT_ALLOWED, OK } from "@/utils/http-status-codes";
import { sendEmailWithVerificationToken } from "@/utils/lib";
import { userInputSchema, userLoginSchema } from "@/utils/types";
import bcrypt from "bcryptjs";

///////////////Controllers///////////////

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
  const parsedData = userInputSchema.safeParse(req.body)

  // validate
  if (!parsedData.success) {
    res.status(BAD_REQUEST).json({
      message: "Input data invalid",
      errors: parsedData.error.flatten()
    });
    return
  }

  const {name, email, password} = parsedData.data

  // find in DB
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(BAD_REQUEST).json({
        message: "User already exists, Please login",
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

    const { token } = await sendEmailWithVerificationToken(user)
    console.log("tokenfromverifyemail", token)
    // saving token
    user.verificationToken = token

    await user.save()
    
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
    console.log("Inside verify")
    const {token} = req.params
    console.log("tokenFromcontroller", token)
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
    // console.log("user1", user)
    user.isVerified = true
    // console.log("user1", user)
    user.verificationToken = undefined
    // console.log("user1", user)

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

export async function login(req: Request, res: Response) {
  // get data from body
  // verify body data
  // check if the email exits in db
  // if not return error
  // if yes - check whether password is matched with hashedpassword in db
  // if not return error
  // if yes gives back jwt token expiry

  // get data from body and verify
  const parsedData = userLoginSchema.safeParse(req.body)

  if (!parsedData.success) {
    res.status(BAD_REQUEST).json({
      message: "Validation Failed",
      errors: parsedData.error.flatten()
    })
    return
  }

  const {email, password} = parsedData.data
  
  try {

    const user = await User.findOne({ email })
    
    if (!user) {
      res.status(BAD_REQUEST).json({
        message: "Invalid Creditionals"
      })
      return
    }
    console.log("Loginuser", user)

    const isPasswordMatch = await bcrypt.compare(
      password,
      user.password
    )

    if (!isPasswordMatch) {
      res.status(BAD_REQUEST).json({
        message: "Invalid Creditionals"
      })
      return
    }

    // check if user is verified or not
    const userVerifiedStatus = user.isVerified

    if (!userVerifiedStatus) {
      const { token } = await sendEmailWithVerificationToken(user)
      user.verificationToken = token
      await user.save()
      res.status(METHOD_NOT_ALLOWED).json({
        message: "Please verify before login. Verfication Link Sent"
      })
      return
    }

    // token generate
    const token = jwt.sign(
      {
      id: user._id,
      role: user.role,
      name: user.name,
      email: user.email
      },
      env.JWT_SECRET,
      {
      expiresIn: "24h"
      }
    )

    // console.log("token", token)

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 25*60*600*1000 // 24 hr
    })

    res.status(OK).json({
      message: "Login successfully",
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })
    return

  } catch (error) {
    console.error(error)
    res.status(INTERNAL_SERVER_ERROR).json({
      message: "Unable to login"
    })
  }
}

export async function logout(req: Request, res: Response) {
  
}
