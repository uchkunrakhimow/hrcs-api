import { t } from "elysia";

export const CreateAssignmentCandidateTestDto = t.Object({
  type: t.Enum({
    persona: "persona",
  }),
  name: t.String({ minLength: 1 }),
  description: t.Optional(t.String()),
  language: t.Optional(
    t.Enum({
      RU: "RU",
      UZ: "UZ",
    })
  ),
});

export const UpdateAssignmentCandidateTestDto = t.Object({
  type: t.Optional(
    t.Enum({
      persona: "persona",
    })
  ),
  name: t.Optional(t.String({ minLength: 1 })),
  description: t.Optional(t.String()),
  language: t.Optional(
    t.Enum({
      RU: "RU",
      UZ: "UZ",
    })
  ),
});

export const AssignmentCandidateTestDto = t.Object({
  id: t.String(),
  type: t.String(),
  name: t.String(),
  description: t.Optional(t.String()),
  language: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export const AssignmentCandidateTestListDto = t.Object({
  tests: t.Array(AssignmentCandidateTestDto),
  total: t.Number(),
  page: t.Number(),
  limit: t.Number(),
});

export const AssignmentCandidateTestParamsDto = t.Object({
  id: t.String({
    format: "uuid",
  }),
});

export const AssignmentCandidateTestQueryDto = t.Object({
  page: t.Optional(t.String({ pattern: "^\\d+$" })),
  limit: t.Optional(t.String({ pattern: "^\\d+$" })),
});
