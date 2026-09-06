import { API_VERSION } from "@digitora/config";
import { Router } from "express";

import { SERVICE_NAME } from "../constants.js";

export const apiV1Router = Router();

apiV1Router.get("/", (_request, response) => {
  response.status(200).json({
    data: {
      service: SERVICE_NAME,
      version: API_VERSION,
      status: "available",
    },
  });
});
