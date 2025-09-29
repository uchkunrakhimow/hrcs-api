import { PrismaClient } from "../../generated/prisma";
import {
  AssignmentCandidateTestBO,
  CreateAssignmentCandidateTestRequestBO,
  UpdateAssignmentCandidateTestRequestBO,
  AssignmentCandidateTestListResponseBO,
} from "./assignment-candidate-test.bo";

export class AssignmentCandidateTestService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(
    data: CreateAssignmentCandidateTestRequestBO
  ): Promise<AssignmentCandidateTestBO> {
    const test = await this.prisma.assignmentCandidateTest.create({
      data: {
        type: data.type as any,
        name: data.name,
        description: data.description,
        language: (data.language as any) || "RU",
      },
    });

    return test as AssignmentCandidateTestBO;
  }

  async findById(id: string): Promise<AssignmentCandidateTestBO | null> {
    const test = await this.prisma.assignmentCandidateTest.findUnique({
      where: { id },
    });

    return test as AssignmentCandidateTestBO | null;
  }

  async findAll(
    page: number = 1,
    limit: number = 10
  ): Promise<AssignmentCandidateTestListResponseBO> {
    const skip = (page - 1) * limit;
    const where: any = {};

    const [tests, total] = await Promise.all([
      this.prisma.assignmentCandidateTest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.assignmentCandidateTest.count({ where }),
    ]);

    return {
      tests: tests as AssignmentCandidateTestBO[],
      total,
      page,
      limit,
    };
  }

  async update(
    id: string,
    data: UpdateAssignmentCandidateTestRequestBO
  ): Promise<AssignmentCandidateTestBO> {
    const updateData: any = {};

    if (data.type !== undefined) {
      updateData.type = data.type;
    }

    if (data.name !== undefined) {
      updateData.name = data.name;
    }

    if (data.description !== undefined) {
      updateData.description = data.description;
    }

    if (data.language !== undefined) {
      updateData.language = data.language;
    }

    const test = await this.prisma.assignmentCandidateTest.update({
      where: { id },
      data: updateData,
    });

    return test as AssignmentCandidateTestBO;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.assignmentCandidateTest.delete({
      where: { id },
    });
  }
}
