import pino from "pino";
import logger from "pino-http";
import pretty from "pino-pretty";

import env from "@/utils/env";

export function pinoLogger() {
  const prettyStream = pretty({
    colorize: true,
    colorizeObjects: true,
  });
  const destination = env.NODE_ENV === "production" ? undefined : prettyStream;

  const baseLogger = pino(
    {
      level: env.LOG_LEVEL || "info",
    },
    destination,

  );

  return logger({
    logger: baseLogger,
    genReqId: () => crypto.randomUUID(),
  });
}
