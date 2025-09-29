import { PrismaClient } from "../../generated/prisma";
import {
  OrganizationBO,
  CreateOrganizationRequestBO,
  UpdateOrganizationRequestBO,
  OrganizationListResponseBO,
} from "./organization.bo";

export class OrganizationService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(data: CreateOrganizationRequestBO): Promise<OrganizationBO> {
    const organization = await this.prisma.organization.create({
      data: {
        name: data.name,
      },
    });

    return organization as OrganizationBO;
  }

  async findById(id: string): Promise<OrganizationBO | null> {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
    });

    return organization as OrganizationBO | null;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<OrganizationListResponseBO> {
    const skip = (page - 1) * limit;
    const where = search
      ? {
          name: {
            contains: search,
            mode: "insensitive" as const,
          },
        }
      : {};

    const [organizations, total] = await Promise.all([
      this.prisma.organization.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.organization.count({ where }),
    ]);

    return {
      organizations: organizations as OrganizationBO[],
      total,
      page,
      limit,
    };
  }

  async update(
    id: string,
    data: UpdateOrganizationRequestBO
  ): Promise<OrganizationBO> {
    const organization = await this.prisma.organization.update({
      where: { id },
      data: {
        name: data.name,
      },
    });

    return organization as OrganizationBO;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.organization.delete({
      where: { id },
    });
  }
}
