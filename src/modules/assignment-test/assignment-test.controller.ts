import { Elysia, t } from "elysia";
import { AssignmentTestService } from "./assignment-test.service";
import {
  CreateAssignmentTestDto,
  UpdateAssignmentTestDto,
  AssignmentTestDto,
  AssignmentTestListDto,
  AssignmentTestParamsDto,
  AssignmentTestQueryDto,
} from "./assignment-test.dto";

export class AssignmentTestController {
  private assignmentTestService: AssignmentTestService;

  constructor() {
    this.assignmentTestService = new AssignmentTestService();
  }

  createRoutes() {
    return new Elysia({ prefix: "/assignment-test" })
      .post(
        "/",
        async ({ body, status }) => {
          try {
            const data = {
              testId: body.testId ?? undefined,
              sendDate: body.sendDate ?? undefined,
              status: body.status ?? undefined,
              count: body.count ?? undefined,
              markedCount: body.markedCount ?? undefined,
              assignmentId: body.assignmentId ?? undefined,
            };
            return await this.assignmentTestService.create(data);
          } catch (err) {
            return status(400, {
              message:
                err instanceof Error
                  ? err.message
                  : "Failed to create assignment test",
            });
          }
        },
        {
          body: CreateAssignmentTestDto,
          response: {
            200: AssignmentTestDto,
            400: t.Object({
              message: t.String(),
            }),
          },
        }
      )
      .get(
        "/",
        async ({ query, status }) => {
          try {
            const page = query.page ? parseInt(query.page) : 1;
            const limit = query.limit ? parseInt(query.limit) : 10;

            const result = await this.assignmentTestService.findAll(
              page,
              limit
            );
            return {
              tests: result.tests,
              total: result.total,
              page: result.page,
              limit: result.limit,
            };
          } catch (err) {
            return status(500, {
              message:
                err instanceof Error
                  ? err.message
                  : "Failed to fetch assignment tests",
            });
          }
        },
        {
          query: AssignmentTestQueryDto,
          response: {
            200: AssignmentTestListDto,
            500: t.Object({
              message: t.String(),
            }),
          },
        }
      )
      .get(
        "/:id",
        async ({ params, status }) => {
          try {
            const assignmentTest = await this.assignmentTestService.findById(
              params.id
            );
            if (!assignmentTest) {
              return status(404, { message: "Assignment test not found" });
            }
            return assignmentTest;
          } catch (err) {
            return status(500, {
              message:
                err instanceof Error
                  ? err.message
                  : "Failed to fetch assignment test",
            });
          }
        },
        {
          params: AssignmentTestParamsDto,
          response: {
            200: AssignmentTestDto,
            404: t.Object({
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
            const data = {
              testId: body.testId ?? undefined,
              sendDate: body.sendDate ?? undefined,
              status: body.status ?? undefined,
              count: body.count ?? undefined,
              markedCount: body.markedCount ?? undefined,
              assignmentId: body.assignmentId ?? undefined,
            };
            return await this.assignmentTestService.update(params.id, data);
          } catch (err) {
            return status(400, {
              message:
                err instanceof Error
                  ? err.message
                  : "Failed to update assignment test",
            });
          }
        },
        {
          params: AssignmentTestParamsDto,
          body: UpdateAssignmentTestDto,
          response: {
            200: AssignmentTestDto,
            400: t.Object({
              message: t.String(),
            }),
          },
        }
      )
      .delete(
        "/:id",
        async ({ params, status }) => {
          try {
            await this.assignmentTestService.delete(params.id);
            return { message: "Assignment test deleted successfully" };
          } catch (err) {
            return status(400, {
              message:
                err instanceof Error
                  ? err.message
                  : "Failed to delete assignment test",
            });
          }
        },
        {
          params: AssignmentTestParamsDto,
          response: {
            200: t.Object({
              message: t.String(),
            }),
            400: t.Object({
              message: t.String(),
            }),
          },
        }
      );
  }
}
