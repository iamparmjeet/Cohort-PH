import { INTERNAL_SERVER_ERROR } from "@/utils/http-status-codes"
import type { NextFunction, Request, Response } from "express"

export const isLoggedIn = async function (req:Request, res:Response, next: NextFunction) {
  // get the token from the cookie
  // extract the token details
  /// match the token details with the db
  // if not match throw error and remove existing token
  // if match give user profile
  
  try {
    const cookie = req.cookies.token
    console.log("cookie", cookie)
  
  } catch (error) {
    console.error(error)
      res.status(INTERNAL_SERVER_ERROR).json({
          message: "Unauthorized access"
        })
  }
  next()
}