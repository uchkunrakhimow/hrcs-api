import { t } from "elysia";

export const CreateUserDto = t.Object({
  email: t.String(),
  password: t.String(),
  name: t.String(),
  role: t.Optional(t.Union([t.Literal("ADMIN"), t.Literal("USER")])),
  organizationId: t.Nullable(t.String()),
});

export const UpdateUserDto = t.Object({
  email: t.Optional(t.String()),
  password: t.Optional(t.String()),
  name: t.Optional(t.String()),
  role: t.Optional(t.Union([t.Literal("ADMIN"), t.Literal("USER")])),
  organizationId: t.Nullable(t.String()),
});

export const UserDto = t.Object({
  id: t.String(),
  email: t.String(),
  name: t.String(),
  role: t.Union([t.Literal("ADMIN"), t.Literal("USER")]),
  organizationId: t.Nullable(t.String()),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export const UserListDto = t.Object({
  users: t.Array(UserDto),
  total: t.Number(),
  page: t.Number(),
  limit: t.Number(),
});

export const UserParamsDto = t.Object({
  id: t.String(),
});

export const UserQueryDto = t.Object({
  page: t.Optional(t.String()),
  limit: t.Optional(t.String()),
  search: t.Optional(t.String()),
  role: t.Optional(t.Union([t.Literal("ADMIN"), t.Literal("USER")])),
});
