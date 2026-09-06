import { API_VERSION } from "@digitora/config";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import { env } from "./config/env.js";
import { logger as applicationLogger } from "./lib/logger.js";
import { errorHandler } from "./middleware/error-handler.js";
import { createHttpLogger } from "./middleware/http-logger.js";
import { notFoundHandler } from "./middleware/not-found.js";
import { healthRouter } from "./routes/health.routes.js";
import { apiV1Router } from "./routes/v1.routes.js";

const ALLOWED_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"];

const ALLOWED_HEADERS = ["Authorization", "Content-Type", "X-Request-Id", "Idempotency-Key"];

export function createApp({ environment = env, logger = applicationLogger } = {}) {
  const app = express();

  app.disable("x-powered-by");

  app.use(createHttpLogger({ logger }));
  app.use(helmet());

  app.use(
    cors({
      origin: environment.WEB_ORIGIN,
      credentials: true,
      methods: ALLOWED_METHODS,
      allowedHeaders: ALLOWED_HEADERS,
      exposedHeaders: ["X-Request-Id"],
      maxAge: 86_400,
    }),
  );

  app.use(express.json({ limit: "1mb" }));

  app.use(healthRouter);
  app.use(`/api/${API_VERSION}`, apiV1Router);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
