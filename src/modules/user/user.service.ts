import { PrismaClient } from "../../generated/prisma";
import { hashPassword } from "../helpers/passwd";
import {
  UserBO,
  CreateUserRequestBO,
  UpdateUserRequestBO,
  UserListResponseBO,
} from "./user.bo";

export class UserService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(data: CreateUserRequestBO): Promise<UserBO> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: data.role || "USER",
        organizationId: data.organizationId,
      },
    });

    return user as UserBO;
  }

  async findById(id: string): Promise<UserBO | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        organization: true,
      },
    });

    return user as UserBO | null;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    role?: string,
    organizationId?: string
  ): Promise<UserListResponseBO> {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (organizationId) {
      where.organizationId = organizationId;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          organization: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users: users as UserBO[],
      total,
      page,
      limit,
    };
  }

  async update(id: string, data: UpdateUserRequestBO): Promise<UserBO> {
    const updateData: any = {};

    if (data.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser && existingUser.id !== id) {
        throw new Error("User with this email already exists");
      }

      updateData.email = data.email;
    }

    if (data.password) {
      updateData.password = await hashPassword(data.password);
    }

    if (data.name) {
      updateData.name = data.name;
    }

    if (data.role) {
      updateData.role = data.role;
    }

    if (data.organizationId) {
      updateData.organizationId = data.organizationId;
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        organization: true,
      },
    });

    return user as UserBO;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
