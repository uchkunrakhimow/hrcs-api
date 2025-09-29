import { t } from "elysia";

export const CreateAssignmentCandidateDto = t.Object({
  fullname: t.String({ minLength: 1, maxLength: 255 }),
  age: t.Optional(t.Number({ minimum: 1, maximum: 120 })),
  gender: t.Optional(t.Enum({ MALE: "MALE", FEMALE: "FEMALE" })),
  companyId: t.Optional(t.String({ format: "uuid" })),
  phone: t.Optional(t.String()),
  telegram: t.Optional(t.String()),
  email: t.Optional(t.String({ format: "email" })),
  city: t.Optional(t.String()),
  link: t.String(),
  countryCode: t.Optional(t.String()),
});

export const UpdateAssignmentCandidateDto = t.Object({
  fullname: t.Optional(t.String({ minLength: 1, maxLength: 255 })),
  age: t.Optional(t.Number({ minimum: 1, maximum: 120 })),
  gender: t.Optional(t.Enum({ MALE: "MALE", FEMALE: "FEMALE" })),
  companyId: t.Optional(t.String({ format: "uuid" })),
  phone: t.Optional(t.String()),
  telegram: t.Optional(t.String()),
  email: t.Optional(t.String({ format: "email" })),
  city: t.Optional(t.String()),
  countryCode: t.Optional(t.String()),
});

export const AssignmentCandidateDto = t.Object({
  id: t.String(),
  fullname: t.String(),
  age: t.Optional(t.Union([t.Number(), t.Null()])),
  gender: t.Optional(
    t.Union([t.Enum({ MALE: "MALE", FEMALE: "FEMALE" }), t.Null()])
  ),
  companyId: t.Optional(t.Union([t.String(), t.Null()])),
  phone: t.Optional(t.Union([t.String(), t.Null()])),
  telegram: t.Optional(t.Union([t.String(), t.Null()])),
  email: t.Optional(t.Union([t.String(), t.Null()])),
  city: t.Optional(t.Union([t.String(), t.Null()])),
  link: t.Optional(t.Union([t.String(), t.Null()])),
  countryCode: t.Optional(t.Union([t.String(), t.Null()])),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export const AssignmentCandidateListDto = t.Object({
  candidates: t.Array(AssignmentCandidateDto),
  total: t.Number(),
  page: t.Number(),
  limit: t.Number(),
});

export const AssignmentCandidateParamsDto = t.Object({
  id: t.String({ format: "uuid" }),
});

export const AssignmentCandidateQueryDto = t.Object({
  page: t.Optional(t.String({ pattern: "^\\d+$" })),
  limit: t.Optional(t.String({ pattern: "^\\d+$" })),
  search: t.Optional(t.String()),
  gender: t.Optional(t.Enum({ MALE: "MALE", FEMALE: "FEMALE" })),
  companyId: t.Optional(t.String({ format: "uuid" })),
  city: t.Optional(t.String()),
  countryCode: t.Optional(t.String()),
});
