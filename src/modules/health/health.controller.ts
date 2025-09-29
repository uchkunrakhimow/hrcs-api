import { Elysia, t } from "elysia";
import { HealthService } from "./health.service";
import { HealthStatusDto } from "./health.dto";

export class HealthController {
  private healthService: HealthService;

  constructor() {
    this.healthService = new HealthService();
  }

  createRoutes() {
    return new Elysia({ prefix: "/health" }).get(
      "/",
      async ({ status }) => {
        try {
          return await this.healthService.getHealthStatus();
        } catch (err) {
          return status(500, {
            status: "error",
            timestamp: new Date().toISOString(),
            error: err instanceof Error ? err.message : "Health check failed",
          });
        }
      },
      {
        response: {
          200: HealthStatusDto,
          500: t.Object({
            status: t.Literal("error"),
            timestamp: t.String(),
            error: t.String(),
          }),
        },
      }
    );
  }
}
