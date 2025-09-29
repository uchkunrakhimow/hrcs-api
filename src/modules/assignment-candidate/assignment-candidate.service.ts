import { PrismaClient } from "../../generated/prisma";
import {
  AssignmentCandidateBO,
  CreateAssignmentCandidateRequestBO,
  UpdateAssignmentCandidateRequestBO,
  AssignmentCandidateListResponseBO,
} from "./assignment-candidate.bo";

export class AssignmentCandidateService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(
    data: CreateAssignmentCandidateRequestBO
  ): Promise<AssignmentCandidateBO> {
    const candidate = await this.prisma.assignmentCandidate.create({ data });
    return candidate as AssignmentCandidateBO;
  }

  async findById(id: string): Promise<AssignmentCandidateBO | null> {
    const candidate = await this.prisma.assignmentCandidate.findUnique({
      where: { id },
      include: {
        company: true,
      },
    });

    return candidate as AssignmentCandidateBO | null;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    gender?: string,
    companyId?: string,
    city?: string,
    countryCode?: string
  ): Promise<AssignmentCandidateListResponseBO> {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { fullname: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { telegram: { contains: search, mode: "insensitive" } },
      ];
    }

    if (gender) {
      where.gender = gender;
    }

    if (companyId) {
      where.companyId = companyId;
    }

    if (city) {
      where.city = { contains: city, mode: "insensitive" };
    }

    if (countryCode) {
      where.countryCode = countryCode;
    }

    const [candidates, total] = await Promise.all([
      this.prisma.assignmentCandidate.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          company: true,
        },
      }),
      this.prisma.assignmentCandidate.count({ where }),
    ]);

    return {
      candidates: candidates as AssignmentCandidateBO[],
      total,
      page,
      limit,
    };
  }

  async update(
    id: string,
    data: UpdateAssignmentCandidateRequestBO
  ): Promise<AssignmentCandidateBO> {
    const updateData: any = {};

    if (data.fullname) {
      updateData.fullname = data.fullname;
    }

    if (data.age !== undefined) {
      updateData.age = data.age;
    }

    if (data.gender !== undefined) {
      updateData.gender = data.gender;
    }

    if (data.companyId !== undefined) {
      updateData.companyId = data.companyId;
    }

    if (data.phone !== undefined) {
      updateData.phone = data.phone;
    }

    if (data.telegram !== undefined) {
      updateData.telegram = data.telegram;
    }

    if (data.email !== undefined) {
      updateData.email = data.email;
    }

    if (data.city !== undefined) {
      updateData.city = data.city;
    }

    if (data.countryCode !== undefined) {
      updateData.countryCode = data.countryCode;
    }

    const candidate = await this.prisma.assignmentCandidate.update({
      where: { id },
      data: updateData,
      include: {
        company: true,
      },
    });

    return candidate as AssignmentCandidateBO;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.assignmentCandidate.delete({
      where: { id },
    });
  }
}
