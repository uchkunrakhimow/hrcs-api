import { t } from "elysia";

export const LoginDto = t.Object({
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 6 }),
});

export const RegisterDto = t.Object({
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 6 }),
  name: t.String({ minLength: 2 }),
  role: t.Optional(t.Union([t.Literal("ADMIN"), t.Literal("USER")])),
});

export const JwtPayloadDto = t.Object({
  sub: t.String({ format: "uuid" }),
});

export const AuthResponseDto = t.Object({
  accessToken: t.String(),
  user: t.Object({
    id: t.String(),
    email: t.String(),
    name: t.String(),
    role: t.Union([t.Literal("ADMIN"), t.Literal("USER")]),
    organizationId: t.Union([t.String(), t.Null()]),
  }),
});
