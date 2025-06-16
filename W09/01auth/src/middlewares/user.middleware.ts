import { BAD_REQUEST } from "@/utils/http-status-codes";
import { userTokenSchema } from "@/utils/types";
import type { Request, Response, NextFunction } from "express";


export const validateTokenPresence = (req: Request, res: Response, next: NextFunction) => {
  const token = req.params.token

  const validatedToken = userTokenSchema.safeParse({token})

  console.log('ValidationResult:', validatedToken)

  if (!validatedToken.success) {
    const firstIssue = validatedToken.error.issues[0]
    res.status(BAD_REQUEST).json({
      message: firstIssue?.message || "A valid token is required",
      success: false
    })
    return
  }
  next()
}