import { API_VERSION } from "@digitora/config";
import { Router } from "express";

import { SERVICE_NAME } from "../constants.js";
import { requireAuthentication } from "../middleware/require-authentication.js";

export function createApiV1Router({ authenticationMiddleware = requireAuthentication } = {}) {
  const router = Router();

  router.get("/", (_request, response) => {
    response.status(200).json({
      data: {
        service: SERVICE_NAME,
        version: API_VERSION,
        status: "available",
      },
    });
  });

  router.get("/me", authenticationMiddleware, (request, response) => {
    response.status(200).json({
      data: {
        user: {
          id: request.auth.userId,
          email: request.auth.claims.email ?? null,
        },
      },
    });
  });

  return router;
}
