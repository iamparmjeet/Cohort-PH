/* eslint-disable no-console */
import type { Request, Response } from "express";
import jwt from "jsonwebtoken"

import User from "@/db/user.model";
import env from "@/utils/env";
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, METHOD_NOT_ALLOWED, OK } from "@/utils/http-status-codes";
import { sendEmailWithVerificationToken } from "@/utils/lib";
import { userInputSchema, userLoginSchema, type JwtUserPayload } from "@/utils/types";
import bcrypt from "bcryptjs";

///////////////Controllers///////////////

export async function registerUser(req: Request, res: Response): Promise<Response> {
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
    return res.status(BAD_REQUEST).json({
      message: "Input data invalid",
      errors: parsedData.error.flatten(),
      success: false
    });
  }

  const { name, email, password } = parsedData.data

  // find in DB
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(BAD_REQUEST).json({
        message: "User already exists, Please login",
        success: false,
      });
    }

    // create a new user
    const user = await User.create({ name, email, password });

    if (!user) {
      return res.status(BAD_REQUEST).json({
        message: "Unable to register user",
        success: false
      });
    }

    console.log("user", user);

    const { token } = await sendEmailWithVerificationToken(user)
    console.log("tokenfromverifyemail", token)
    // saving token
    user.verificationToken = token

    await user.save()

    return res.status(CREATED).json({
      message: "User Register successfully. Please verify your email.",
      success: true
    })
  }
  catch (error) {
    console.error("Registration error:", error);
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: "An error occured during registration",
      success: false
    })
  }
}

export async function verifyUser(req: Request, res: Response): Promise<Response> {
  // get the token from params (url)
  // validate token
  // check token based on token in db
  // if not
  // if match - setVerified true
  // remove verificationtoken from db
  // save and return response

  // getting the token
  try {
    const token = req.cookies.token as string
    // console.log("tokenFromcontroller", token)
    if (!token) {
      return res.status(BAD_REQUEST).json({
        message: "Invalid token",
        success: false
      })
    }

    const user = await User.findOne({ verificationToken: token })

    if (!user) {
      return res.status(BAD_REQUEST).json({
        message: "Invalid token",
        success: false
      })
    }

    user.isVerified = true
    user.verificationToken = undefined

    await user.save()

    return res.status(OK).json({
      message: "Verfication success",
      success: true
    })
  } catch (error) {
    console.error("Verfication error:", error);
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: "An error occured during Verfication",
      success: false
    })
  }


}

export async function login(req: Request, res: Response): Promise<Response> {
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
    return res.status(BAD_REQUEST).json({
      message: "Validation Failed",
      errors: parsedData.error.flatten(),
      success: false
    })
  }

  const { email, password } = parsedData.data

  try {

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(BAD_REQUEST).json({
        message: "Invalid Creditionals",
        success: false
      })
    }
    console.log("Loginuser", user)

    const isPasswordMatch = await bcrypt.compare(
      password,
      user.password
    )

    if (!isPasswordMatch) {
      return res.status(BAD_REQUEST).json({
        message: "Invalid Creditionals",
        success: false
      })
    }

    // check if user is verified or not
    const userVerifiedStatus = user.isVerified

    if (!userVerifiedStatus) {
      const { token } = await sendEmailWithVerificationToken(user)
      user.verificationToken = token
      await user.save()
      return res.status(METHOD_NOT_ALLOWED).json({
        message: "Please verify before login. Verfication Link Sent",
        success: false
      })
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
      maxAge: 25 * 60 * 600 * 1000 // 24 hr
    })

    return res.status(OK).json({
      message: "Login successfully",
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })

  } catch (error) {
    console.error(error)
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: "Unable to login",
      success: false
    })
  }
}

export async function getMe(req: Request, res: Response): Promise<Response> {
  // get token
  // extract token details
  // match token details with db
  // if not match throw error and remove existing token
  // if match give user profile

  try {
    const user = req.user as JwtUserPayload

    // matching the token details with db
    if (!user) {
      return res.status(BAD_REQUEST).json({
        message: "Invalid token",
        success: false
      })
    }
    const validUser = await User.findById(user.id).select("-password")
    // console.log("verifiedUser", validUser)

    return res.status(OK).json({
      message: "User Profile",
      success: true,
      data: validUser
    })
  } catch (error) {
    console.error(error)
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: "Unable to get user profile",
      success: false
    })
  }
}


export async function logoutUser(req: Request, res: Response): Promise<Response> {
  // get token
  // whether token exists or not clear cookie and token
  try {
    const token = req.cookies.token as string
    console.log("cookie", token)
    res.clearCookie("token")
    return res.status(OK).json({
      message: "logout success",
      success: true,
    })
  } catch (error) {
    console.error(error)
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: "Unable to logout",
      success: false,
    })
  }
}

export async function resetPassword(req: Request, res: Response): Promise<Response> {
  return res.status(METHOD_NOT_ALLOWED).json({ message: "Not implemented" })
}

export async function forgotPassword(req: Request, res: Response): Promise<Response> {
  return res.status(METHOD_NOT_ALLOWED).json({ message: "Not implemented" })
}
