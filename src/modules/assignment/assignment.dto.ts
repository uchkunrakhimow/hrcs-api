import { t } from "elysia";
import { AssignmentCandidateDto } from "../assignment-candidate/assignment-candidate.dto";
import { OrganizationDto } from "../organization/organization.dto";
import {
  AssignmentTestDto,
  CreateAssignmentTestDto,
} from "../assignment-test/assignment-test.dto";

export const CreateAssignmentDto = t.Object({
  assignmentCandidate: t.Object({
    fullname: t.String({ minLength: 1, maxLength: 255 }),
    age: t.Optional(t.Number({ minimum: 1, maximum: 120 })),
    gender: t.Optional(t.Enum({ MALE: "MALE", FEMALE: "FEMALE" })),
    companyId: t.Optional(t.String({ format: "uuid" })),
    phone: t.Optional(t.String()),
    telegram: t.Optional(t.String()),
    email: t.Optional(t.String({ format: "email" })),
    city: t.Optional(t.String()),
    countryCode: t.Optional(t.String()),
  }),
  folderId: t.Optional(t.String()),
  isArchive: t.Optional(t.Boolean()),
  assignmentTest: t.Optional(CreateAssignmentTestDto),
});

export const UpdateAssignmentDto = t.Object({
  isArchive: t.Boolean(),
});

export const AssignmentDto = t.Object({
  id: t.String(),
  code: t.String(),
  assignmentCandidateId: t.Optional(t.Union([t.String(), t.Null()])),
  folderId: t.Optional(t.Union([t.String(), t.Null()])),
  isArchive: t.Boolean(),
  assignmentCandidate: t.Optional(t.Union([AssignmentCandidateDto, t.Null()])),
  folder: t.Optional(t.Union([OrganizationDto, t.Null()])),
  assignmentTest: t.Optional(t.Union([AssignmentTestDto, t.Null()])),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export const AssignmentListDto = t.Object({
  assignments: t.Array(AssignmentDto),
  total: t.Number(),
  page: t.Number(),
  limit: t.Number(),
});

export const AssignmentParamsDto = t.Object({
  id: t.String({ format: "uuid" }),
});

export const AssignmentQueryDto = t.Object({
  page: t.Optional(t.String({ pattern: "^\\d+$" })),
  limit: t.Optional(t.String({ pattern: "^\\d+$" })),
  search: t.Optional(t.String()),
  isArchive: t.Optional(t.Boolean()),
  folderId: t.Optional(t.String({ format: "uuid" })),
  assignmentCandidateId: t.Optional(t.String({ format: "uuid" })),
});
