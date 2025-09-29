import { Elysia, t } from "elysia";
import { AssignmentCandidateService } from "./assignment-candidate.service";
import {
  CreateAssignmentCandidateDto,
  UpdateAssignmentCandidateDto,
  AssignmentCandidateDto,
  AssignmentCandidateListDto,
  AssignmentCandidateParamsDto,
  AssignmentCandidateQueryDto,
} from "./assignment-candidate.dto";

export class AssignmentCandidateController {
  private assignmentCandidateService: AssignmentCandidateService;

  constructor() {
    this.assignmentCandidateService = new AssignmentCandidateService();
  }

  createRoutes() {
    return new Elysia({ prefix: "/assignment-candidate" })
      .post(
        "/",
        async ({ body, status }) => {
          try {
            return await this.assignmentCandidateService.create(body);
          } catch (err) {
            return status(400, {
              message:
                err instanceof Error
                  ? err.message
                  : "Failed to create assignment candidate",
            });
          }
        },
        {
          body: CreateAssignmentCandidateDto,
          response: {
            200: AssignmentCandidateDto,
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
            const gender = query.gender;
            const companyId = query.companyId;
            const city = query.city;
            const countryCode = query.countryCode;

            const result = await this.assignmentCandidateService.findAll(
              page,
              limit,
              search,
              gender,
              companyId,
              city,
              countryCode
            );
            return {
              candidates: result.candidates,
              total: result.total,
              page: result.page,
              limit: result.limit,
            };
          } catch (err) {
            return status(500, {
              message:
                err instanceof Error
                  ? err.message
                  : "Failed to fetch assignment candidates",
            });
          }
        },
        {
          query: AssignmentCandidateQueryDto,
          response: {
            200: AssignmentCandidateListDto,
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
            const candidate = await this.assignmentCandidateService.findById(
              params.id
            );
            if (!candidate) {
              return status(404, { message: "Assignment candidate not found" });
            }
            return candidate;
          } catch (err) {
            return status(500, {
              message:
                err instanceof Error
                  ? err.message
                  : "Failed to fetch assignment candidate",
            });
          }
        },
        {
          params: AssignmentCandidateParamsDto,
          response: {
            200: AssignmentCandidateDto,
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
            return await this.assignmentCandidateService.update(
              params.id,
              body
            );
          } catch (err) {
            return status(400, {
              message:
                err instanceof Error
                  ? err.message
                  : "Failed to update assignment candidate",
            });
          }
        },
        {
          params: AssignmentCandidateParamsDto,
          body: UpdateAssignmentCandidateDto,
          response: {
            200: AssignmentCandidateDto,
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
            await this.assignmentCandidateService.delete(params.id);
            return { message: "Assignment candidate deleted successfully" };
          } catch (err) {
            return status(400, {
              message:
                err instanceof Error
                  ? err.message
                  : "Failed to delete assignment candidate",
            });
          }
        },
        {
          params: AssignmentCandidateParamsDto,
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
