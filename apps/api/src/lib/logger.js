import pino from "pino";

import { env } from "../config/env.js";
import { SERVICE_NAME } from "../constants.js";

const logLevel = env.NODE_ENV === "test" ? "silent" : env.LOG_LEVEL;

export const logger = pino({
  level: logLevel,
  base: {
    service: SERVICE_NAME,
    environment: env.NODE_ENV,
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});
