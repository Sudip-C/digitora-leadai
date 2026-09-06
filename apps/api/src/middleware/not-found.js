import { AppError } from "../errors/app-error.js";

export function notFoundHandler(request, _response, next) {
  next(
    new AppError({
      code: "ROUTE_NOT_FOUND",
      message: `Route ${request.method} ${request.path} was not found.`,
      statusCode: 404,
    }),
  );
}
