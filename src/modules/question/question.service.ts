import { PrismaClient } from "../../generated/prisma";
import { QuestionBO, UpdateQuestionRequestBO } from "./question.bo";
import {
  QuestionNotFoundError,
  AnswerNotFoundError,
  AssignmentNotFoundError,
  AssignmentTestNotFoundError,
} from "./question.errors";

export class QuestionService {
  private static prisma = new PrismaClient();

  async findById(testId: string, assignmentId: string): Promise<QuestionBO[]> {
    const [questions, selected] = await Promise.all([
      QuestionService.prisma.question.findMany({
        where: { testId },
        include: {
          answers: { orderBy: { id: "asc" } },
        },
        orderBy: { number: "asc" },
      }),
      QuestionService.prisma.candidateAnswer.findMany({
        where: { assignmentId },
        select: { questionId: true, answerId: true },
      }),
    ]);

    if (questions.length === 0) {
      throw new QuestionNotFoundError(testId);
    }

    await this.initProgress(assignmentId);

    const selectedMap = new Map(
      selected.map((s) => [s.questionId, s.answerId])
    );

    const shaped = questions.map((q) => ({
      ...q,
      answers: q.answers.map((a) => ({
        ...a,
        marked: selectedMap.get(q.id) === a.id,
      })),
    }));

    return shaped as QuestionBO[];
  }

  async update(
    questionId: string,
    data: UpdateQuestionRequestBO
  ): Promise<QuestionBO> {
    const result = await QuestionService.prisma.$transaction(async (tx) => {
      const ans = await tx.answer.findUnique({
        where: { id: data.answerId },
        select: { id: true, questionId: true },
      });
      if (!ans || ans.questionId !== questionId) {
        throw new AnswerNotFoundError(data.answerId);
      }

      await tx.candidateAnswer.upsert({
        where: {
          assignmentId_questionId: {
            assignmentId: data.assignmentId,
            questionId: questionId,
          },
        },
        create: {
          assignmentId: data.assignmentId,
          questionId: questionId,
          answerId: data.answerId,
        },
        update: { answerId: data.answerId },
      });

      await this.calculateProgress(tx, data.assignmentId);

      const [question, selected] = await Promise.all([
        tx.question.findUnique({
          where: { id: questionId },
          include: { answers: { orderBy: { id: "asc" } } },
        }),
        tx.candidateAnswer.findUnique({
          where: {
            assignmentId_questionId: {
              assignmentId: data.assignmentId,
              questionId: questionId,
            },
          },
        }),
      ]);

      if (!question) throw new QuestionNotFoundError(questionId);

      const answers = question.answers.map((a) => ({
        ...a,
        marked: selected?.answerId === a.id,
      }));

      return { ...question, answers } as QuestionBO;
    });

    return result;
  }

  private async initProgress(assignmentId: string): Promise<void> {
    const assignment = await QuestionService.prisma.assignment.findUnique({
      where: { id: assignmentId },
      select: { assignmentTestId: true },
    });

    if (!assignment?.assignmentTestId) {
      throw new AssignmentNotFoundError(assignmentId);
    }

    const assignmentTest =
      await QuestionService.prisma.assignmentTest.findUnique({
        where: { id: assignment.assignmentTestId },
        select: { status: true },
      });

    if (assignmentTest?.status) return;

    await this.calculateProgress(QuestionService.prisma, assignmentId);
  }

  private async calculateProgress(
    prisma: any,
    assignmentId: string
  ): Promise<void> {
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      select: { assignmentTestId: true },
    });

    if (!assignment?.assignmentTestId) {
      throw new AssignmentNotFoundError(assignmentId);
    }

    const assignmentTest = await prisma.assignmentTest.findUnique({
      where: { id: assignment.assignmentTestId },
      select: { testId: true },
    });

    if (!assignmentTest?.testId) {
      throw new AssignmentTestNotFoundError(assignment.assignmentTestId);
    }

    const [totalQuestions, markedCount] = await Promise.all([
      prisma.question.count({
        where: { testId: assignmentTest.testId },
      }),
      prisma.candidateAnswer.count({
        where: { assignmentId },
      }),
    ]);

    const status = this.getStatus(markedCount, totalQuestions);

    await prisma.assignmentTest.update({
      where: { id: assignment.assignmentTestId },
      data: {
        markedCount,
        status,
        count: totalQuestions,
      },
    });
  }

  private getStatus(
    markedCount: number,
    totalQuestions: number
  ): "finished" | "started" | "not_started" {
    if (markedCount === 0) return "not_started";
    if (markedCount === totalQuestions) return "finished";
    return "started";
  }
}
