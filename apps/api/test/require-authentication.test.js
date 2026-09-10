import { describe, expect, it, vi } from "vitest";

import { AppError } from "../src/errors/app-error.js";
import { createRequireAuthentication } from "../src/middleware/require-authentication.js";

const environment = {
  SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test-key",
};

function createRequest(authorization) {
  return {
    get: vi.fn((headerName) => (headerName === "authorization" ? authorization : undefined)),
  };
}

async function runMiddleware(middleware, request) {
  const next = vi.fn();

  await middleware(request, {}, next);

  return next;
}

describe("requireAuthentication", () => {
  it("rejects missing and malformed bearer tokens", async () => {
    const createClient = vi.fn();
    const middleware = createRequireAuthentication({
      environment,
      createClient,
    });

    for (const authorization of [undefined, "", "Basic credentials", "Bearer"]) {
      const next = await runMiddleware(middleware, createRequest(authorization));

      expect(next).toHaveBeenCalledOnce();

      const error = next.mock.calls[0][0];

      expect(error).toBeInstanceOf(AppError);
      expect(error).toMatchObject({
        code: "AUTHENTICATION_REQUIRED",
        statusCode: 401,
      });
    }

    expect(createClient).not.toHaveBeenCalled();
  });

  it("rejects tokens that Supabase cannot verify", async () => {
    const supabase = {
      auth: {
        getClaims: vi.fn().mockResolvedValue({
          data: null,
          error: new Error("Invalid token"),
        }),
      },
    };

    const middleware = createRequireAuthentication({
      environment,
      createClient: vi.fn(() => supabase),
    });

    const next = await runMiddleware(middleware, createRequest("Bearer invalid-token"));

    expect(next.mock.calls[0][0]).toMatchObject({
      code: "AUTHENTICATION_REQUIRED",
      statusCode: 401,
    });
  });

  it("rejects anonymous Supabase identities", async () => {
    const supabase = {
      auth: {
        getClaims: vi.fn().mockResolvedValue({
          data: {
            claims: {
              sub: "anonymous-user",
              role: "authenticated",
              is_anonymous: true,
            },
          },
          error: null,
        }),
      },
    };

    const middleware = createRequireAuthentication({
      environment,
      createClient: vi.fn(() => supabase),
    });

    const next = await runMiddleware(middleware, createRequest("Bearer anonymous-token"));

    expect(next.mock.calls[0][0]).toMatchObject({
      code: "AUTHENTICATION_REQUIRED",
      statusCode: 401,
    });
  });

  it("attaches verified identity and the RLS-aware client", async () => {
    const claims = {
      sub: "user-1",
      role: "authenticated",
      is_anonymous: false,
      email: "sudip@example.com",
    };

    const supabase = {
      auth: {
        getClaims: vi.fn().mockResolvedValue({
          data: {
            claims,
          },
          error: null,
        }),
      },
    };

    const createClient = vi.fn(() => supabase);
    const middleware = createRequireAuthentication({
      environment,
      createClient,
    });

    const request = createRequest("Bearer verified-token");
    const next = await runMiddleware(middleware, request);

    expect(createClient).toHaveBeenCalledWith({
      environment,
      accessToken: "verified-token",
    });

    expect(supabase.auth.getClaims).toHaveBeenCalledWith("verified-token");

    expect(request.auth).toEqual({
      userId: "user-1",
      claims,
    });

    expect(request.supabase).toBe(supabase);
    expect(next.mock.calls).toEqual([[]]);
  });
});
