import { Elysia, t } from "elysia";
import { AssignmentCandidateTestService } from "./assignment-candidate-test.service";
import {
  CreateAssignmentCandidateTestDto,
  UpdateAssignmentCandidateTestDto,
  AssignmentCandidateTestDto,
  AssignmentCandidateTestListDto,
  AssignmentCandidateTestParamsDto,
  AssignmentCandidateTestQueryDto,
} from "./assignment-candidate-test.dto";

export class AssignmentCandidateTestController {
  private assignmentCandidateTestService: AssignmentCandidateTestService;

  constructor() {
    this.assignmentCandidateTestService = new AssignmentCandidateTestService();
  }

  createRoutes() {
    return new Elysia({ prefix: "/assignment-candidate-test" })
      .post(
        "/",
        async ({ body, status }) => {
          try {
            return await this.assignmentCandidateTestService.create(body);
          } catch (err) {
            return status(400, {
              message:
                err instanceof Error ? err.message : "Failed to create test",
            });
          }
        },
        {
          body: CreateAssignmentCandidateTestDto,
          response: {
            200: AssignmentCandidateTestDto,
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

            const result = await this.assignmentCandidateTestService.findAll(
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
                err instanceof Error ? err.message : "Failed to fetch tests",
            });
          }
        },
        {
          query: AssignmentCandidateTestQueryDto,
          response: {
            200: AssignmentCandidateTestListDto,
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
            const test = await this.assignmentCandidateTestService.findById(
              params.id
            );
            if (!test) {
              return status(404, { message: "Test not found" });
            }
            return test;
          } catch (err) {
            return status(500, {
              message:
                err instanceof Error ? err.message : "Failed to fetch test",
            });
          }
        },
        {
          params: AssignmentCandidateTestParamsDto,
          response: {
            200: AssignmentCandidateTestDto,
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
            return await this.assignmentCandidateTestService.update(
              params.id,
              body
            );
          } catch (err) {
            return status(400, {
              message:
                err instanceof Error ? err.message : "Failed to update test",
            });
          }
        },
        {
          params: AssignmentCandidateTestParamsDto,
          body: UpdateAssignmentCandidateTestDto,
          response: {
            200: AssignmentCandidateTestDto,
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
            await this.assignmentCandidateTestService.delete(params.id);
            return { message: "Test deleted successfully" };
          } catch (err) {
            return status(400, {
              message:
                err instanceof Error ? err.message : "Failed to delete test",
            });
          }
        },
        {
          params: AssignmentCandidateTestParamsDto,
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
