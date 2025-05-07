import type { NextFunction, Request, Response } from "express";

import type { ErrorResponse } from "@/utils/err-responses";

import env from "@/utils/env";

export function serveEmojiFavicon(emoji = "🔥") {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (req.url === "/favicon.ico") {
      res.setHeader("Content-Type", "image/svg+xml");
      res.end(`<svg xmlns="http://www.w3.org/2000/svg"><text y="32" font-size="32">${emoji}</text></svg>`);
    }
    else {
      next();
    }
  };
}
export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

export function onError(err: Error, req: Request, res: Response<ErrorResponse>) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
}
