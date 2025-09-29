import { Elysia, t } from "elysia";
import { OrganizationService } from "./organization.service";
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
  OrganizationDto,
  OrganizationListDto,
  OrganizationParamsDto,
  OrganizationQueryDto,
} from "./organization.dto";

export class OrganizationController {
  private organizationService: OrganizationService;

  constructor() {
    this.organizationService = new OrganizationService();
  }

  createRoutes() {
    return new Elysia({ prefix: "/organizations" })
      .post(
        "/",
        async ({ body, status }) => {
          try {
            return await this.organizationService.create(body);
          } catch (err) {
            return status(400, {
              message:
                err instanceof Error
                  ? err.message
                  : "Failed to create organization",
            });
          }
        },
        {
          body: CreateOrganizationDto,
          response: {
            200: OrganizationDto,
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

            const result = await this.organizationService.findAll(
              page,
              limit,
              search
            );
            return {
              organizations: result.organizations,
              total: result.total,
              page: result.page,
              limit: result.limit,
            };
          } catch (err) {
            return status(500, {
              message:
                err instanceof Error
                  ? err.message
                  : "Failed to fetch organizations",
            });
          }
        },
        {
          query: OrganizationQueryDto,
          response: {
            200: OrganizationListDto,
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
            const organization = await this.organizationService.findById(
              params.id
            );
            if (!organization) {
              return status(404, { message: "Organization not found" });
            }
            return organization;
          } catch (err) {
            return status(500, {
              message:
                err instanceof Error
                  ? err.message
                  : "Failed to fetch organization",
            });
          }
        },
        {
          params: OrganizationParamsDto,
          response: {
            200: OrganizationDto,
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
            return await this.organizationService.update(params.id, body);
          } catch (err) {
            return status(400, {
              message:
                err instanceof Error
                  ? err.message
                  : "Failed to update organization",
            });
          }
        },
        {
          params: OrganizationParamsDto,
          body: UpdateOrganizationDto,
          response: {
            200: OrganizationDto,
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
            await this.organizationService.delete(params.id);
            return { message: "Organization deleted successfully" };
          } catch (err) {
            return status(400, {
              message:
                err instanceof Error
                  ? err.message
                  : "Failed to delete organization",
            });
          }
        },
        {
          params: OrganizationParamsDto,
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
