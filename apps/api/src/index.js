import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";

const app = createApp();

const server = app.listen(env.API_PORT, () => {
  logger.info(
    {
      port: env.API_PORT,
      environment: env.NODE_ENV,
    },
    "API server started",
  );
});

server.on("error", (error) => {
  logger.fatal({ error }, "API server failed to start");
  process.exitCode = 1;
});
