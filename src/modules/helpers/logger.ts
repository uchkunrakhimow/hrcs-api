import pino from "pino";
import { Elysia } from "elysia";

const isDevelopment = process.env.NODE_ENV === "development";

export const logger = pino({
  level: isDevelopment ? "debug" : "info",
});

export function createRequestLogger() {
  if (!isDevelopment) {
    return new Elysia();
  }

  return new Elysia()
    .onRequest(({ request, set }) => {
      const startTime = Date.now();
      const method = request.method;
      const url = request.url;

      logger.info(
        {
          type: "request",
          method,
          url,
          timestamp: new Date().toISOString(),
        },
        `${method} ${url}`
      );

      set.headers["x-request-start"] = startTime.toString();
    })
    .onAfterHandle(({ request, set, response }) => {
      const method = request.method;
      const url = request.url;
      const statusCode = set.status || 200;
      const requestStart = request.headers.get("x-request-start");
      const duration = requestStart ? Date.now() - parseInt(requestStart) : 0;

      logger.info(
        {
          type: "response",
          method,
          url,
          statusCode,
          duration: `${duration}ms`,
          timestamp: new Date().toISOString(),
        },
        `${method} ${url} ${statusCode} - ${duration}ms`
      );
    })
    .onError(({ error, request, set }) => {
      const method = request.method;
      const url = request.url;
      const statusCode = set.status || 500;

      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;

      logger.error(
        {
          type: "error",
          method,
          url,
          statusCode,
          error: errorMessage,
          stack: errorStack,
          timestamp: new Date().toISOString(),
        },
        `${method} ${url} ${statusCode} - ${errorMessage}`
      );
    });
}
