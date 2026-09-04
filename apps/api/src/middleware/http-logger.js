import { randomUUID } from "node:crypto";

import pinoHttp from "pino-http";

const MAX_REQUEST_ID_LENGTH = 128;

function resolveRequestId(request) {
  const suppliedRequestId = request.headers["x-request-id"];

  if (typeof suppliedRequestId === "string") {
    const requestId = suppliedRequestId.trim();

    if (requestId && requestId.length <= MAX_REQUEST_ID_LENGTH) {
      return requestId;
    }
  }

  return randomUUID();
}

export function createHttpLogger({ logger }) {
  return pinoHttp({
    logger,

    genReqId(request, response) {
      const requestId = resolveRequestId(request);

      response.setHeader("X-Request-Id", requestId);

      return requestId;
    },

    customLogLevel(_request, response, error) {
      if (error || response.statusCode >= 500) {
        return "error";
      }

      if (response.statusCode >= 400) {
        return "warn";
      }

      return "info";
    },

    serializers: {
      req(request) {
        return {
          id: request.id,
          method: request.method,
          url: request.url,
          remoteAddress: request.remoteAddress,
        };
      },

      res(response) {
        return {
          statusCode: response.statusCode,
        };
      },
    },
  });
}
