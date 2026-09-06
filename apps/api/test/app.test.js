import pino from "pino";
import request from "supertest";
import { describe, expect, test } from "vitest";

import { createApp } from "../src/app.js";

const ALLOWED_ORIGIN = "http://localhost:5173";
const silentLogger = pino({ level: "silent" });

const app = createApp({
  environment: {
    WEB_ORIGIN: ALLOWED_ORIGIN,
  },
  logger: silentLogger,
});

describe("API foundation", () => {
  test("returns the liveness status", async () => {
    const response = await request(app).get("/health").expect("Content-Type", /json/).expect(200);

    expect(response.body).toEqual({
      status: "ok",
      service: "digitora-leadai-api",
    });

    expect(response.headers["x-request-id"]).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  test("returns the readiness status", async () => {
    const response = await request(app).get("/ready").expect(200);

    expect(response.body).toEqual({
      status: "ready",
      service: "digitora-leadai-api",
      checks: {
        api: "ok",
      },
    });
  });

  test("exposes the versioned API root", async () => {
    const response = await request(app).get("/api/v1").expect(200);

    expect(response.body).toEqual({
      data: {
        service: "digitora-leadai-api",
        version: "v1",
        status: "available",
      },
    });
  });

  test("adds security, CORS, and request ID headers", async () => {
    const response = await request(app)
      .get("/health")
      .set("Origin", ALLOWED_ORIGIN)
      .set("X-Request-Id", "test-request-001")
      .expect(200);

    expect(response.headers["x-request-id"]).toBe("test-request-001");
    expect(response.headers["access-control-allow-origin"]).toBe(ALLOWED_ORIGIN);
    expect(response.headers["access-control-allow-credentials"]).toBe("true");
    expect(response.headers["x-content-type-options"]).toBe("nosniff");
    expect(response.headers).not.toHaveProperty("x-powered-by");
  });

  test("returns a consistent error for an unknown route", async () => {
    const response = await request(app)
      .get("/missing")
      .set("X-Request-Id", "not-found-test")
      .expect(404);

    expect(response.body).toEqual({
      error: {
        code: "ROUTE_NOT_FOUND",
        message: "Route GET /missing was not found.",
        requestId: "not-found-test",
      },
    });
  });

  test("returns a consistent error for malformed JSON", async () => {
    const response = await request(app)
      .post("/api/v1/test")
      .set("Content-Type", "application/json")
      .set("X-Request-Id", "invalid-json-test")
      .send('{"broken":')
      .expect(400);

    expect(response.body).toEqual({
      error: {
        code: "INVALID_JSON",
        message: "Request body contains invalid JSON.",
        requestId: "invalid-json-test",
      },
    });
  });
});
