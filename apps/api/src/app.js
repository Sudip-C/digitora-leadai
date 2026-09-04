import express from "express";

import { logger as applicationLogger } from "./lib/logger.js";
import { createHttpLogger } from "./middleware/http-logger.js";

export function createApp({ logger = applicationLogger } = {}) {
  const app = express();

  app.disable("x-powered-by");
  app.use(createHttpLogger({ logger }));
  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (_request, response) => {
    response.status(200).json({
      status: "ok",
      service: "digitora-leadai-api",
    });
  });

  return app;
}
