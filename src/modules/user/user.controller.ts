import { Elysia, t } from "elysia";
import { UserService } from "./user.service";
import {
  CreateUserDto,
  UpdateUserDto,
  UserDto,
  UserListDto,
  UserParamsDto,
  UserQueryDto,
} from "./user.dto";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  createRoutes() {
    return new Elysia({ prefix: "/users" })
      .post(
        "/",
        async ({ body, status }) => {
          try {
            return await this.userService.create(body);
          } catch (err) {
            return status(400, {
              message:
                err instanceof Error ? err.message : "Failed to create user",
            });
          }
        },
        {
          body: CreateUserDto,
          response: {
            200: UserDto,
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
            const role = query.role;

            const result = await this.userService.findAll(
              page,
              limit,
              search,
              role
            );
            return {
              users: result.users,
              total: result.total,
              page: result.page,
              limit: result.limit,
            };
          } catch (err) {
            return status(500, {
              message:
                err instanceof Error ? err.message : "Failed to fetch users",
            });
          }
        },
        {
          query: UserQueryDto,
          response: {
            200: UserListDto,
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
            const user = await this.userService.findById(params.id);
            if (!user) {
              return status(404, { message: "User not found" });
            }
            return user;
          } catch (err) {
            return status(500, {
              message:
                err instanceof Error ? err.message : "Failed to fetch user",
            });
          }
        },
        {
          params: UserParamsDto,
          response: {
            200: UserDto,
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
            return await this.userService.update(params.id, body);
          } catch (err) {
            return status(400, {
              message:
                err instanceof Error ? err.message : "Failed to update user",
            });
          }
        },
        {
          params: UserParamsDto,
          body: UpdateUserDto,
          response: {
            200: UserDto,
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
            await this.userService.delete(params.id);
            return { message: "User deleted successfully" };
          } catch (err) {
            return status(400, {
              message:
                err instanceof Error ? err.message : "Failed to delete user",
            });
          }
        },
        {
          params: UserParamsDto,
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
