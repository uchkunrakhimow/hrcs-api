import { UserBO } from "../user";
export type Role = "ADMIN" | "USER";

export interface JwtPayloadBO {
  sub: string;
  exp: number;
}

export interface AuthResponseBO {
  accessToken: string;
  user: UserBO;
}

export interface LoginRequestBO {
  email: string;
  password: string;
}

export interface RegisterRequestBO {
  email: string;
  password: string;
  name: string;
  role?: Role;
}

export interface TokenValidationResult {
  isValid: boolean;
  payload?: JwtPayloadBO;
  error?: string;
}

export interface AuthContext {
  user: UserBO;
  payload: JwtPayloadBO;
}
