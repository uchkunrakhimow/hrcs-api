import { Elysia, t } from "elysia";
import { QuestionService } from "./question.service";
import {
  UpdateQuestionDto,
  QuestionDto,
  QuestionQueryDto,
} from "./question.dto";

export class QuestionController {
  private questionService: QuestionService;

  constructor() {
    this.questionService = new QuestionService();
  }

  createRoutes() {
    return new Elysia({ prefix: "/questions" })
      .get(
        "/",
        async ({ query, status }) => {
          try {
            return await this.questionService.findById(
              query.testId,
              query.assignmentId
            );
          } catch (err) {
            return status(500, {
              message:
                err instanceof Error
                  ? err.message
                  : "Failed to fetch questions",
            });
          }
        },
        {
          query: QuestionQueryDto,
          response: {
            200: t.Array(QuestionDto),
            400: t.Object({
              message: t.String(),
            }),
            500: t.Object({
              message: t.String(),
            }),
          },
        }
      )
      .put(
        "/:id",
        async ({ params, body, status }) => {
          try {
            return await this.questionService.update(params.id, body);
          } catch (err) {
            return status(400, {
              message:
                err instanceof Error
                  ? err.message
                  : "Failed to update answer selection",
            });
          }
        },
        {
          params: t.Object({
            id: t.String({ format: "uuid" }),
          }),
          body: UpdateQuestionDto,
          response: {
            200: QuestionDto,
            400: t.Object({
              message: t.String(),
            }),
          },
        }
      );
  }
}
