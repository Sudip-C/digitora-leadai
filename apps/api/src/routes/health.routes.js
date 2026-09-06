import { Router } from "express";

import { SERVICE_NAME } from "../constants.js";

export const healthRouter = Router();

healthRouter.get("/health", (_request, response) => {
  response.status(200).json({
    status: "ok",
    service: SERVICE_NAME,
  });
});

healthRouter.get("/ready", (_request, response) => {
  response.status(200).json({
    status: "ready",
    service: SERVICE_NAME,
    checks: {
      api: "ok",
    },
  });
});
