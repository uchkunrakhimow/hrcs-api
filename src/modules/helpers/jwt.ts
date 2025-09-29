import { jwt } from "@elysiajs/jwt";

export const jwtConfig = {
  name: "jwt",
  secret: process.env["JWT_SECRET"]!,
  exp: "30d",
};

export function createJwtPlugin() {
  return jwt(jwtConfig);
}

export async function generateToken(
  jwtInstance: any,
  userId: string
): Promise<string> {
  return await jwtInstance.sign({
    sub: userId,
  });
}
