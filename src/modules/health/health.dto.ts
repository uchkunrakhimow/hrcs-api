import { t } from "elysia";

export const HealthStatusDto = t.Object({
  status: t.Union([t.Literal("ok"), t.Literal("error")]),
  timestamp: t.String(),
  uptime: t.Number(),
  version: t.String(),
  environment: t.String(),
  database: t.Object({
    status: t.Union([t.Literal("connected"), t.Literal("disconnected")]),
    responseTime: t.Optional(t.Number()),
  }),
  memory: t.Object({
    used: t.Number(),
    total: t.Number(),
    percentage: t.Number(),
  }),
});

export const SimpleHealthDto = t.Object({
  status: t.Literal("ok"),
  timestamp: t.String(),
});
