/* eslint-disable no-console */
import type { Request, Response } from "express";
import jwt from "jsonwebtoken"

import User from "@/db/user.model";
import env from "@/utils/env";
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, METHOD_NOT_ALLOWED, OK } from "@/utils/http-status-codes";
import { sendEmailWithVerificationToken } from "@/utils/lib";
import { userInputSchema, userLoginSchema, userResetPasswordSchema, userTokenSchema, type JwtUserPayload } from "@/utils/types";
import bcrypt from "bcryptjs";

///////////////Controllers///////////////

export async function registerUser(req: Request, res: Response): Promise<void> {
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
      errors: parsedData.error.flatten(),
      success: false
    });
    return
  }

  const { name, email, password } = parsedData.data

  // find in DB
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(BAD_REQUEST).json({
        message: "User already exists, Please login",
        success: false,
      });
      return
    }

    // create a new user
    const user = await User.create({ name, email, password });

    if (!user) {
      res.status(BAD_REQUEST).json({
        message: "Unable to register user",
        success: false
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
      message: "User Register successfully. Please verify your email.",
      success: true
    })
    return
  }
  catch (error) {
    console.error("Registration error:", error);
    res.status(INTERNAL_SERVER_ERROR).json({
      message: "An error occured during registration",
      success: false
    })
    return
  }
}

export async function verifyUserEmptyToken(req: Request, res: Response): Promise<void> {
  res.status(BAD_REQUEST).json({
    message: "Token is required",
    success: false
  })
  return
}

export async function verifyUser(req: Request, res: Response): Promise<void> {
  // get the token from params (url)
  // validate token
  // check token based on token in db
  // if not
  // if match - setVerified true
  // remove verificationtoken from db
  // save and return response

  // getting the token
  try {
    const token = req.params.token
    // console.log("tokenFromcontroller", token)
    if (!token) {
      res.status(BAD_REQUEST).json({
        message: "Token is requiored or invalid",
        success: false
      })
      return
    }

    const user = await User.findOne({ verificationToken: token })

    if (!user) {
      res.status(BAD_REQUEST).json({
        message: "Invalid token",
        success: false
      })
      return
    }

    user.isVerified = true
    user.verificationToken = undefined

    await user.save()

    res.status(OK).json({
      message: "Verfication success",
      success: true
    })
    return
  } catch (error) {
    console.error("Verfication error:", error);
    res.status(INTERNAL_SERVER_ERROR).json({
      message: "An error occured during Verfication",
      success: false
    })
  }


}

export async function login(req: Request, res: Response): Promise<void> {
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
      errors: parsedData.error.flatten(),
      success: false
    })
    return
  }

  const { email, password } = parsedData.data

  try {

    const user = await User.findOne({ email })

    if (!user) {
      res.status(BAD_REQUEST).json({
        message: "Invalid Creditionals",
        success: false
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
        message: "Invalid Creditionals",
        success: false
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
        message: "Please verify before login. Verfication Link Sent",
        success: false
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
      maxAge: 25 * 60 * 600 * 1000 // 24 hr
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
      message: "Unable to login",
      success: false
    })
    return
  }
}

export async function getMe(req: Request, res: Response): Promise<void> {
  // get token
  // extract token details
  // match token details with db
  // if not match throw error and remove existing token
  // if match give user profile

  try {
    const user = req.user as JwtUserPayload

    // matching the token details with db
    if (!user) {
      res.status(BAD_REQUEST).json({
        message: "Invalid token",
        success: false
      })
      return
    }
    const validUser = await User.findById(user.id).select("-password")
    // console.log("verifiedUser", validUser)

    res.status(OK).json({
      message: "User Profile",
      success: true,
      data: validUser
    })
    return
  } catch (error) {
    console.error(error)
    res.status(INTERNAL_SERVER_ERROR).json({
      message: "Unable to get user profile",
      success: false
    })
    return
  }
}

export async function logoutUser(req: Request, res: Response): Promise<void> {
  // get token
  // whether token exists or not clear cookie and token
  try {
    const token = req.cookies.token as string
    console.log("cookie", token)
    res.clearCookie("token")
    res.status(OK).json({
      message: "logout success",
      success: true,
    })
    return
  } catch (error) {
    console.error(error)
    res.status(INTERNAL_SERVER_ERROR).json({
      message: "Unable to logout",
      success: false,
    })
    return
  }
}

export async function resetPassword(req: Request, res: Response): Promise<void> {
  // Here User is logged in and trying to reset password
  // get token from body
  // decode token
  // check if token is valid
  // if valid - check if user exists in db
  // if not return error
  // if yes - check if password is same as old password
  // if not return error
  // if yes update password in db
  // return success message
  // Either clear cookie or send new token or let the user to login again
  const token = req.cookies.token as string
  const password = userResetPasswordSchema.parse(req.body).password
  const newPassword = userResetPasswordSchema.parse(req.body).newPassword

  try {
    const validToken = jwt.verify(token, env.JWT_SECRET) as JwtUserPayload
  
    if (!validToken) {
      res.clearCookie("tpken")
      res.status(BAD_REQUEST).json({
        message: "Invalid token",
        success: false
      })
      return
    }
  
    const { id } = validToken
  
    // const validUser = await User.findById(id)
    const validUser = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: {$gt: Date.now()}
    })
    
    console.log("validUser", validUser)
  
    if (!validUser) {
      res.status(BAD_REQUEST).json({
        message: "User not found",
        success: false
      })
      return
    }
  
    // if validuser old
    const isPasswordMatch = await bcrypt.compare(password, validUser.password)
  
    if (!isPasswordMatch) {
      res.status(BAD_REQUEST).json({
        message: "Please add a valid last password",
        success: false
      })
    }
  
    const savePasswordResponse = await validUser.updateOne({
      password: newPassword
    })
    console.log("savePasswordResponse", savePasswordResponse)
  
    await validUser.save()
    
    res.status(OK).json({
      message: "Password Update successfully",
      success: true
    })
    return
  } catch (error) {
    console.error(error)
    res.status(INTERNAL_SERVER_ERROR).json({
      message: "Unable to reset password",
      success: false
    })
    return
  }
}

export async function forgotPassword(req: Request, res: Response): Promise<void> {
  // get email from body
  // check email in db
  // if not exist return error
  // if exist - create a token
  // save token in db - reset token  + reset expiry => Date.now() + 10 * 60 * 1000
  // send token as email
  // return success message

  const { email } = userInputSchema.parse(req.body)
  
  if (!email) {
    res.status(BAD_REQUEST).json({
      message: "Email is required",
      success: false
    })
    return
  }

  try {
    const validUser = await User.findOne({ email })
    
    if (!validUser) {
      res.status(BAD_REQUEST).json({
        message: ""
      })
    }

  } catch (error) {
    
  }

  res.status(METHOD_NOT_ALLOWED).json({ message: "Not implemented" })
  return
}
