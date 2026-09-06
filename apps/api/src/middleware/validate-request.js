import { AppError } from "../errors/app-error.js";

function formatValidationIssues(issues) {
  return issues.map((issue) => ({
    code: issue.code,
    path: issue.path.map(String),
    message: issue.message,
  }));
}

export function validateRequest(requestSchema) {
  return async function requestValidationMiddleware(request, _response, next) {
    const result = await requestSchema.safeParseAsync({
      body: request.body,
      params: request.params,
      query: request.query,
    });

    if (!result.success) {
      return next(
        new AppError({
          code: "VALIDATION_ERROR",
          message: "The request contains invalid data.",
          statusCode: 422,
          details: formatValidationIssues(result.error.issues),
        }),
      );
    }

    request.validated = result.data;

    return next();
  };
}
