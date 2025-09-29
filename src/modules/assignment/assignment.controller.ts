import { Elysia, t } from "elysia";
import { AssignmentService } from "./assignment.service";
import {
  CreateAssignmentDto,
  UpdateAssignmentDto,
  AssignmentDto,
  AssignmentListDto,
  AssignmentParamsDto,
  AssignmentQueryDto,
} from "./assignment.dto";

export class AssignmentController {
  private assignmentService: AssignmentService;

  constructor() {
    this.assignmentService = new AssignmentService();
  }

  createRoutes() {
    return new Elysia({ prefix: "/assignments" })
      .post(
        "/",
        async ({ body, status }) => {
          try {
            const data = {
              ...body,
              assignmentTest: body.assignmentTest ? {
                testId: body.assignmentTest.testId ?? undefined,
                sendDate: body.assignmentTest.sendDate ?? undefined,
                status: body.assignmentTest.status ?? undefined,
                count: body.assignmentTest.count ?? undefined,
                markedCount: body.assignmentTest.markedCount ?? undefined,
              } : undefined,
            };
            return await this.assignmentService.create(data);
          } catch (err) {
            return status(400, {
              message:
                err instanceof Error
                  ? err.message
                  : "Failed to create assignment",
            });
          }
        },
        {
          body: CreateAssignmentDto,
          response: {
            200: AssignmentDto,
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
            const search = query.search;
            const isArchive = query.isArchive;
            const folderId = query.folderId;
            const assignmentCandidateId = query.assignmentCandidateId;

            return await this.assignmentService.findAll(
              page,
              limit,
              search,
              isArchive,
              folderId,
              assignmentCandidateId
            );
          } catch (err) {
            return status(500, {
              message:
                err instanceof Error
                  ? err.message
                  : "Failed to fetch assignments",
            });
          }
        },
        {
          query: AssignmentQueryDto,
          response: {
            200: AssignmentListDto,
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
            const assignment = await this.assignmentService.findById(params.id);
            if (!assignment) {
              return status(404, { message: "Assignment not found" });
            }
            return assignment;
          } catch (err) {
            return status(500, {
              message:
                err instanceof Error
                  ? err.message
                  : "Failed to fetch assignment",
            });
          }
        },
        {
          params: AssignmentParamsDto,
          response: {
            200: AssignmentDto,
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
            return await this.assignmentService.update(params.id, body);
          } catch (err) {
            return status(400, {
              message:
                err instanceof Error
                  ? err.message
                  : "Failed to update assignment",
            });
          }
        },
        {
          params: AssignmentParamsDto,
          body: UpdateAssignmentDto,
          response: {
            200: AssignmentDto,
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
            await this.assignmentService.delete(params.id);
            return { message: "Assignment deleted successfully" };
          } catch (err) {
            return status(400, {
              message:
                err instanceof Error
                  ? err.message
                  : "Failed to delete assignment",
            });
          }
        },
        {
          params: AssignmentParamsDto,
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
