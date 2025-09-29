import { t } from "elysia";

export const CreateOrganizationDto = t.Object({
  name: t.String({ minLength: 1, maxLength: 255 }),
});

export const UpdateOrganizationDto = t.Object({
  name: t.Optional(t.String({ minLength: 1, maxLength: 255 })),
});

export const OrganizationDto = t.Object({
  id: t.String(),
  name: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export const OrganizationListDto = t.Object({
  organizations: t.Array(OrganizationDto),
  total: t.Number(),
  page: t.Number(),
  limit: t.Number(),
});

export const OrganizationParamsDto = t.Object({
  id: t.String({ format: "uuid" }),
});

export const OrganizationQueryDto = t.Object({
  page: t.Optional(t.String({ pattern: "^\\d+$" })),
  limit: t.Optional(t.String({ pattern: "^\\d+$" })),
  search: t.Optional(t.String()),
});
