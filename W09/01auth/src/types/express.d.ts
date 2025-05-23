import type { JwtUserPayload } from "@/utils/types"

declare global {
  namespace Express {
    interface Request {
      user?: JwtUserPayload 
    }
  }
}
