import { env } from "../config/env.js";
import { AppError } from "../errors/app-error.js";
import { createSupabaseServerClient } from "../lib/supabase.js";

function createAuthenticationError() {
  return new AppError({
    code: "AUTHENTICATION_REQUIRED",
    message: "A valid bearer token is required.",
    statusCode: 401,
  });
}

function extractBearerToken(request) {
  const authorization =
    typeof request.get === "function"
      ? request.get("authorization")
      : request.headers?.authorization;

  if (typeof authorization !== "string") {
    return null;
  }

  const match = authorization.trim().match(/^Bearer\s+(\S+)$/i);

  return match?.[1] ?? null;
}

export function createRequireAuthentication({
  environment = env,
  createClient = createSupabaseServerClient,
} = {}) {
  return async function requireAuthentication(request, _response, next) {
    const accessToken = extractBearerToken(request);

    if (!accessToken) {
      return next(createAuthenticationError());
    }

    try {
      const supabase = createClient({
        environment,
        accessToken,
      });

      const { data, error } = await supabase.auth.getClaims(accessToken);
      const claims = data?.claims;

      if (
        error ||
        !claims?.sub ||
        claims.role !== "authenticated" ||
        claims.is_anonymous === true
      ) {
        return next(createAuthenticationError());
      }

      request.auth = {
        userId: claims.sub,
        claims,
      };

      request.supabase = supabase;

      return next();
    } catch {
      return next(createAuthenticationError());
    }
  };
}

export const requireAuthentication = createRequireAuthentication();
