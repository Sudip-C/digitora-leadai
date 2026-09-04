import { config as loadEnvironmentFile } from "dotenv";
import { z } from "zod";

import { DEFAULT_TIMEZONE } from "@digitora/config";

loadEnvironmentFile({
  path: new URL("../../../../.env", import.meta.url),
  quiet: true,
});

const environmentSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
  API_PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  WEB_ORIGIN: z.url().default("http://localhost:5173"),
  APP_TIMEZONE: z.string().trim().min(1).default(DEFAULT_TIMEZONE),
});

export function parseEnvironment(source) {
  const result = environmentSchema.safeParse(source);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");

    throw new Error(`Invalid environment configuration: ${details}`);
  }

  return Object.freeze(result.data);
}

export const env = parseEnvironment(process.env);
