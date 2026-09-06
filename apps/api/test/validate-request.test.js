import { z } from "zod";
import { expect, test } from "vitest";

import { AppError } from "../src/errors/app-error.js";
import { validateRequest } from "../src/middleware/validate-request.js";

async function runMiddleware(middleware, request) {
  let nextValue;

  await middleware(request, {}, (value) => {
    nextValue = value;
  });

  return nextValue;
}

const requestSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1),
    limit: z.coerce.number().int().positive().default(20),
  }),
  params: z.object({}),
  query: z.object({}),
});

test("stores parsed request data for the controller", async () => {
  const request = {
    body: {
      name: "  Digitora  ",
      limit: "10",
    },
    params: {},
    query: {},
  };

  const error = await runMiddleware(validateRequest(requestSchema), request);

  expect(error).toBeUndefined();
  expect(request.validated).toEqual({
    body: {
      name: "Digitora",
      limit: 10,
    },
    params: {},
    query: {},
  });
});

test("returns a structured validation error", async () => {
  const request = {
    body: {
      name: "",
      limit: 0,
    },
    params: {},
    query: {},
  };

  const error = await runMiddleware(validateRequest(requestSchema), request);

  expect(error).toBeInstanceOf(AppError);
  expect(error).toMatchObject({
    code: "VALIDATION_ERROR",
    message: "The request contains invalid data.",
    statusCode: 422,
  });

  expect(error.details).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        path: ["body", "name"],
      }),
      expect.objectContaining({
        path: ["body", "limit"],
      }),
    ]),
  );
});
