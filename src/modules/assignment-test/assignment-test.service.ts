import { PrismaClient } from "../../generated/prisma";
import {
  AssignmentTestBO,
  CreateAssignmentTestRequestBO,
  UpdateAssignmentTestRequestBO,
  AssignmentTestListResponseBO,
} from "./assignment-test.bo";

export class AssignmentTestService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(data: CreateAssignmentTestRequestBO): Promise<AssignmentTestBO> {
    return await this.prisma.assignmentTest.create({
      data: {
        testId: data.testId,
        sendDate: data.sendDate,
        status: data.status,
        count: data.count,
        markedCount: data.markedCount,
        assignments: {
          connect: {
            id: data.assignmentId,
          },
        },
      },
    }) as AssignmentTestBO;
  }

  async findById(id: string): Promise<AssignmentTestBO | null> {
    const assignmentTest = await this.prisma.assignmentTest.findUnique({
      where: { id },
      include: {
        test: true,
        assignments: true,
      },
    });

    return assignmentTest as AssignmentTestBO | null;
  }

  async findAll(
    page: number = 1,
    limit: number = 10
  ): Promise<AssignmentTestListResponseBO> {
    const skip = (page - 1) * limit;
    const where: any = {};

    const [tests, total] = await Promise.all([
      this.prisma.assignmentTest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          test: true,
          assignments: true,
        },
      }),
      this.prisma.assignmentTest.count({ where }),
    ]);

    return {
      tests: tests as AssignmentTestBO[],
      total,
      page,
      limit,
    };
  }

  async update(
    id: string,
    data: UpdateAssignmentTestRequestBO
  ): Promise<AssignmentTestBO> {
    const updateData: any = {};

    if (data.testId !== undefined) {
      updateData.testId = data.testId;
    }

    if (data.sendDate !== undefined) {
      updateData.sendDate = data.sendDate;
    }

    if (data.status !== undefined) {
      updateData.status = data.status;
    }

    if (data.count !== undefined) {
      updateData.count = data.count;
    }

    if (data.markedCount !== undefined) {
      updateData.markedCount = data.markedCount;
    }

    if (data.assignmentId !== undefined) {
      updateData.assignmentId = data.assignmentId;
    }

    const assignmentTest = await this.prisma.assignmentTest.update({
      where: { id },
      data: updateData,
      include: {
        test: true,
        assignments: true,
      },
    });

    return assignmentTest as AssignmentTestBO;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.assignmentTest.delete({
      where: { id },
    });
  }
}
