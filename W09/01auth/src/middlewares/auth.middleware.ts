import jwt from "jsonwebtoken"

import { FORBIDDEN, INTERNAL_SERVER_ERROR } from "@/utils/http-status-codes"
import type { NextFunction, Request, Response } from "express"
import env from "@/utils/env"
import type { JwtUserPayload } from "@/utils/types"

export const isLoggedIn = async function (req:Request, res:Response, next: NextFunction): Promise<void> {
  // get the token from the cookie
  // extract the token details
  /// match the token details with the db
  // if not match throw error and remove existing token
  // if match give user profile
  
  try {
    const token = req.cookies.token

    console.log("token1", token)
    
    if (!token) {
      res.status(FORBIDDEN).json({
        message: "Authenitication token missing",
        success: false
      })
      return
    }

    // extract the token details
    const docodedUser = jwt.verify(token, env.JWT_SECRET) as JwtUserPayload
    console.log("isDocoded", docodedUser)

    if (!docodedUser) {
      res.clearCookie("token", {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict"
      })
    res.status(FORBIDDEN).json({
        message: "Unauthorized access",
        success: false
    })
      return
    }

    req.user = docodedUser
    console.log("userfromMiddleware", req.user)
    
    next()
  } catch (error) {
    console.error(error)
    res.status(INTERNAL_SERVER_ERROR).json({
      message: "Unauthorized access",
      success: false
    })
    return
  }
}