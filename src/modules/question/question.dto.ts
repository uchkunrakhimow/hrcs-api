import { t } from "elysia";

export const UpdateQuestionDto = t.Object({
  assignmentId: t.String({ format: "uuid" }),
  answerId: t.String({ format: "uuid" }),
});

export const QuestionDto = t.Object({
  id: t.String(),
  text: t.String(),
  number: t.Number(),
  testId: t.Nullable(t.String()),
  answers: t.Array(
    t.Object({
      id: t.String(),
      text: t.String(),
      marked: t.Boolean(),
    })
  ),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export const QuestionQueryDto = t.Object({
  testId: t.String({ format: "uuid" }),
  assignmentId: t.String({ format: "uuid" }),
});
