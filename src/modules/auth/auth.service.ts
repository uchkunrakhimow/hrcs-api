import { PrismaClient } from "../../generated/prisma";
import { hashPassword, verifyPassword } from "../helpers/passwd";
import { AuthResponseBO, LoginRequestBO, RegisterRequestBO } from "./auth.bo";
import { UserBO } from "../user/user.bo";
import { AUTH_CONSTANTS } from "./constants";

export class AuthService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async register(data: RegisterRequestBO): Promise<AuthResponseBO> {
    const { email, password, name, role } = data;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error(AUTH_CONSTANTS.ERROR_MESSAGES.EMAIL_EXISTS);
    }

    const hashedPassword = await hashPassword(password);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || AUTH_CONSTANTS.DEFAULT_ROLE,
      },
    });

    return {
      accessToken: "",
      user: user as UserBO,
    };
  }

  async login(data: LoginRequestBO): Promise<AuthResponseBO> {
    const { email, password } = data;

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        organization: true,
      },
    });

    if (!user) {
      throw new Error(AUTH_CONSTANTS.ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error(AUTH_CONSTANTS.ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    return {
      accessToken: "",
      user: user as UserBO,
    };
  }

  async getUserById(userId: string): Promise<UserBO | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        organization: true,
      },
    });

    return user as UserBO | null;
  }
}
