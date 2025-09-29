import { randomUUID } from "node:crypto";
import { sendAssignmentEmail } from "../helpers/email";
import { PrismaClient } from "../../generated/prisma";
import {
  AssignmentBO,
  CreateAssignmentRequestBO,
  UpdateAssignmentRequestBO,
  AssignmentListResponseBO,
} from "./assignment.bo";

export class AssignmentService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(data: CreateAssignmentRequestBO): Promise<AssignmentBO> {
    const candidate = await this.prisma.assignmentCandidate.create({
      data: {
        fullname: data.assignmentCandidate.fullname,
        age: data.assignmentCandidate.age,
        gender: data.assignmentCandidate.gender,
        companyId: data.assignmentCandidate.companyId,
        phone: data.assignmentCandidate.phone,
        telegram: data.assignmentCandidate.telegram,
        email: data.assignmentCandidate.email,
        city: data.assignmentCandidate.city,
        link: `${process.env.CORS_ORIGIN}/testing/${randomUUID()}`,
        countryCode: data.assignmentCandidate.countryCode,
      },
    });

    const assignmentTest = await this.prisma.assignmentTest.create({
      data: {
        testId: data.assignmentTest?.testId,
        sendDate: data.assignmentTest?.sendDate || new Date(),
        status: data.assignmentTest?.status || "not_started",
        count: data.assignmentTest?.count || 0,
        markedCount: data.assignmentTest?.markedCount || 0,
      },
    });

    const assignment = await this.prisma.assignment.create({
      data: {
        assignmentCandidateId: candidate.id,
        folderId: data.folderId,
        isArchive: data.isArchive,
        assignmentTestId: assignmentTest.id,
      },
      include: {
        assignmentCandidate: true,
        folder: true,
        assignmentTest: true,
      },
    });
    if (candidate.email && candidate.link) {
      sendAssignmentEmail(candidate.email, candidate.link);
    }
    return assignment as AssignmentBO;
  }

  async findById(id: string): Promise<AssignmentBO | null> {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id },
      include: {
        assignmentCandidate: true,
        folder: true,
        assignmentTest: true,
      },
    });

    return assignment as AssignmentBO | null;
  }

  async findByTestId(testId: string): Promise<AssignmentBO | null> {
    const assignment = await this.prisma.assignment.findFirst({
      where: {
        assignmentCandidate: {
          link: {
            endsWith: `/${testId}`,
          },
        },
      },
      include: {
        assignmentCandidate: true,
        folder: true,
        assignmentTest: true,
      },
    });

    return assignment as AssignmentBO | null;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    isArchive?: boolean,
    folderId?: string,
    assignmentCandidateId?: string
  ): Promise<AssignmentListResponseBO> {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.assignmentCandidate = {
        fullname: {
          contains: search,
          mode: "insensitive",
        },
      };
    }

    if (isArchive !== undefined) {
      where.isArchive = isArchive;
    }

    if (folderId) {
      where.folderId = folderId;
    }

    if (assignmentCandidateId) {
      where.assignmentCandidateId = assignmentCandidateId;
    }

    const [assignments, total] = await Promise.all([
      this.prisma.assignment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          assignmentCandidate: true,
          folder: true,
          assignmentTest: true,
        },
      }),
      this.prisma.assignment.count({ where }),
    ]);

    return {
      assignments: assignments as AssignmentBO[],
      total,
      page,
      limit,
    };
  }

  async update(
    id: string,
    data: UpdateAssignmentRequestBO
  ): Promise<AssignmentBO> {
    const assignment = await this.prisma.assignment.update({
      where: { id },
      data: {
        isArchive: data.isArchive,
      },
      include: {
        assignmentCandidate: true,
        folder: true,
        assignmentTest: true,
      },
    });

    return assignment as AssignmentBO;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.assignment.delete({
      where: { id },
    });
  }
}
