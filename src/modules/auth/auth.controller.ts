import { Elysia, t } from "elysia";
import { AuthService } from "./auth.service";
import { createJwtPlugin, generateToken } from "../helpers/jwt";
import { LoginDto, RegisterDto, AuthResponseDto } from "./auth.dto";
import { UserDto } from "../user/user.dto";
import { UserBO } from "../user/user.bo";
import { AUTH_CONSTANTS } from "./constants";
import { JwtPayloadBO } from "./auth.bo";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  private async generateAuthResponse(user: UserBO, jwt: any) {
    const token = await generateToken(jwt, user.id);
    return {
      accessToken: token,
      user,
    };
  }

  private handleAuthError(error: unknown, defaultMessage: string) {
    const message = error instanceof Error ? error.message : defaultMessage;
    return { message };
  }

  createRoutes() {
    return new Elysia({ prefix: "/auth" })
      .use(createJwtPlugin())
      .post(
        "/register",
        async ({ body, jwt, status }) => {
          try {
            const result = await this.authService.register(body);
            return await this.generateAuthResponse(result.user, jwt);
          } catch (err) {
            return status(
              400,
              this.handleAuthError(
                err,
                AUTH_CONSTANTS.ERROR_MESSAGES.REGISTRATION_FAILED
              )
            );
          }
        },
        {
          body: RegisterDto,
          response: {
            200: AuthResponseDto,
            400: t.Object({
              message: t.String(),
            }),
          },
        }
      )
      .post(
        "/login",
        async ({ body, jwt, status }) => {
          try {
            const result = await this.authService.login(body);
            return await this.generateAuthResponse(result.user, jwt);
          } catch (err) {
            return status(
              401,
              this.handleAuthError(
                err,
                AUTH_CONSTANTS.ERROR_MESSAGES.LOGIN_FAILED
              )
            );
          }
        },
        {
          body: LoginDto,
          response: {
            200: AuthResponseDto,
            401: t.Object({
              message: t.String(),
            }),
          },
        }
      )
      .get(
        "/me",
        async ({ status, store }) => {
          try {
            const payload: JwtPayloadBO = (store as any).user as JwtPayloadBO;

            const user = await this.authService.getUserById(payload.sub!);

            if (!user) {
              return status(404, {
                message: AUTH_CONSTANTS.ERROR_MESSAGES.USER_NOT_FOUND,
              });
            }

            return { user };
          } catch (err) {
            return status(
              401,
              this.handleAuthError(
                err,
                AUTH_CONSTANTS.ERROR_MESSAGES.AUTHENTICATION_FAILED
              )
            );
          }
        },
        {
          headers: t.Object({
            authorization: t.Optional(t.String()),
          }),
          response: {
            200: t.Object({
              user: UserDto,
            }),
            401: t.Object({
              message: t.String(),
            }),
            404: t.Object({
              message: t.String(),
            }),
          },
        }
      );
  }
}
