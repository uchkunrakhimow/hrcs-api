import { t } from "elysia";

export const CreateAssignmentTestDto = t.Object({
  testId: t.Optional(t.Union([t.String({ format: "uuid" }), t.Null()])),
  sendDate: t.Optional(t.Union([t.Date(), t.Null()])),
  status: t.Optional(
    t.Union([
      t.Enum({
        finished: "finished",
        started: "started",
        not_started: "not_started",
      }),
      t.Null(),
    ])
  ),
  count: t.Optional(t.Union([t.Number({ minimum: 0 }), t.Null()])),
  markedCount: t.Optional(t.Union([t.Number({ minimum: 0 }), t.Null()])),
  assignmentId: t.Optional(t.Union([t.String({ format: "uuid" }), t.Null()])),
});

export const UpdateAssignmentTestDto = t.Object({
  testId: t.Optional(t.Union([t.String({ format: "uuid" }), t.Null()])),
  sendDate: t.Optional(t.Union([t.Date(), t.Null()])),
  status: t.Optional(
    t.Union([
      t.Enum({
        finished: "finished",
        started: "started",
        not_started: "not_started",
      }),
      t.Null(),
    ])
  ),
  count: t.Optional(t.Union([t.Number({ minimum: 0 }), t.Null()])),
  markedCount: t.Optional(t.Union([t.Number({ minimum: 0 }), t.Null()])),
  assignmentId: t.Optional(t.Union([t.String({ format: "uuid" }), t.Null()])),
});

export const AssignmentTestDto = t.Object({
  id: t.String(),
  testId: t.Optional(t.Union([t.String(), t.Null()])),
  sendDate: t.Optional(t.Union([t.Date(), t.Null()])),
  status: t.Optional(
    t.Union([
      t.Enum({
        finished: "finished",
        started: "started",
        not_started: "not_started",
      }),
      t.Null(),
    ])
  ),
  count: t.Optional(t.Union([t.Number(), t.Null()])),
  markedCount: t.Optional(t.Union([t.Number(), t.Null()])),
  assignmentId: t.Optional(t.Union([t.String(), t.Null()])),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export const AssignmentTestListDto = t.Object({
  tests: t.Array(AssignmentTestDto),
  total: t.Number(),
  page: t.Number(),
  limit: t.Number(),
});

export const AssignmentTestParamsDto = t.Object({
  id: t.String(),
});

export const AssignmentTestQueryDto = t.Object({
  page: t.Optional(t.String({ pattern: "^\\d+$" })),
  limit: t.Optional(t.String({ pattern: "^\\d+$" })),
});
