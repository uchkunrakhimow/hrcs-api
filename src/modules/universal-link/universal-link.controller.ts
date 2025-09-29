import { Elysia, t } from "elysia";
import { randomUUID } from "node:crypto";
import { AssignmentCandidateService } from "../assignment-candidate/assignment-candidate.service";
import { AssignmentTestService } from "../assignment-test/assignment-test.service";
import { AssignmentService } from "../assignment/assignment.service";

export class UniversalLinkController {
  private assignmentCandidateService: AssignmentCandidateService;
  private assignmentTestService: AssignmentTestService;
  private assignmentService: AssignmentService;

  constructor() {
    this.assignmentCandidateService = new AssignmentCandidateService();
    this.assignmentTestService = new AssignmentTestService();
    this.assignmentService = new AssignmentService();
  }

  createRoutes() {
    return new Elysia({ prefix: "/links" })
      .get(
        "/",
        async ({ status }) => {
          try {
            return `${process.env.CORS_ORIGIN}/testing/${randomUUID()}`;
          } catch (err) {
            return status(500, {
              message:
                err instanceof Error
                  ? err.message
                  : "Failed to fetch universal link",
            });
          }
        },
        {
          response: {
            200: t.String(),
            404: t.Object({
              message: t.String(),
            }),
            500: t.Object({
              message: t.String(),
            }),
          },
        }
      )
      .get(
        "/candidate",
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
          query: t.Object({
            page: t.Optional(t.String()),
            limit: t.Optional(t.String()),
            search: t.Optional(t.String()),
            gender: t.Optional(t.String()),
            companyId: t.Optional(t.String()),
            city: t.Optional(t.String()),
            countryCode: t.Optional(t.String()),
          }),
          response: {
            200: t.Object({
              candidates: t.Array(t.Any()),
              total: t.Number(),
              page: t.Number(),
              limit: t.Number(),
            }),
            500: t.Object({
              message: t.String(),
            }),
          },
        }
      )
      .get(
        "/test/:id",
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
          params: t.Object({
            id: t.String(),
          }),
          response: {
            200: t.Any(),
            404: t.Object({
              message: t.String(),
            }),
            500: t.Object({
              message: t.String(),
            }),
          },
        }
      )
      .get(
        "/assignment/:testId",
        async ({ params, status }) => {
          try {
            const assignment = await this.assignmentService.findByTestId(
              params.testId
            );
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
          params: t.Object({
            testId: t.String(),
          }),
          response: {
            200: t.Any(),
            404: t.Object({
              message: t.String(),
            }),
            500: t.Object({
              message: t.String(),
            }),
          },
        }
      );
  }
}
