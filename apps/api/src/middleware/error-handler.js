import { AppError } from "../errors/app-error.js";

function isInvalidJsonError(error) {
  return error instanceof SyntaxError && error.status === 400 && Object.hasOwn(error, "body");
}

function normalizeError(error) {
  if (error instanceof AppError) {
    return {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
      details: error.details,
    };
  }

  if (isInvalidJsonError(error)) {
    return {
      code: "INVALID_JSON",
      message: "Request body contains invalid JSON.",
      statusCode: 400,
    };
  }

  if (error.status === 413) {
    return {
      code: "PAYLOAD_TOO_LARGE",
      message: "Request body exceeds the allowed size.",
      statusCode: 413,
    };
  }

  return {
    code: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred.",
    statusCode: 500,
  };
}

export function errorHandler(error, request, response, next) {
  if (response.headersSent) {
    return next(error);
  }

  const normalizedError = normalizeError(error);

  if (normalizedError.statusCode >= 500) {
    request.log?.error({ err: error }, "Unhandled request error");
  }

  return response.status(normalizedError.statusCode).json({
    error: {
      code: normalizedError.code,
      message: normalizedError.message,
      requestId: request.id,
      ...(normalizedError.details === undefined ? {} : { details: normalizedError.details }),
    },
  });
}
