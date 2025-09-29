import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { createJwtPlugin } from "./modules/helpers/jwt";
import { createRequestLogger } from "./modules/helpers/logger";

import { AuthController } from "./modules/auth";
import { OrganizationController } from "./modules/organization";
import { UserController } from "./modules/user";
import { AssignmentController } from "./modules/assignment";
import { AssignmentCandidateController } from "./modules/assignment-candidate";
import { AssignmentTestController } from "./modules/assignment-test";
import { AssignmentCandidateTestController } from "./modules/assignment-candidate-test";
import { QuestionController } from "./modules/question";
import { UniversalLinkController } from "./modules/universal-link";
import { HealthController } from "./modules/health";
import { ResultController } from "./modules/result/result.controller";

const authController = new AuthController();
const organizationController = new OrganizationController();
const userController = new UserController();
const assignmentController = new AssignmentController();
const assignmentCandidateController = new AssignmentCandidateController();
const assignmentTestController = new AssignmentTestController();
const assignmentCandidateTestController =
  new AssignmentCandidateTestController();
const questionController = new QuestionController();
const universalLinkController = new UniversalLinkController();
const healthController = new HealthController();
const resultController = new ResultController();

const app = new Elysia()
  .use(createRequestLogger())
  .use(
    cors({
      origin: process.env["CORS_ORIGIN"]!,
      credentials: process.env["NODE_ENV"] === "production",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  .use(createJwtPlugin())
  .get("/", "Happy coding!")
  .group("/api/v1", (app) =>
    app

      .use(universalLinkController.createRoutes())
      .use(questionController.createRoutes())
      .use(assignmentController.createRoutes())
      .use(assignmentTestController.createRoutes())
      .use(assignmentCandidateController.createRoutes())
      .use(assignmentCandidateTestController.createRoutes())
      .use(resultController.createRoutes())
      .onBeforeHandle(async ({ jwt, headers, set, store, path }) => {
        const publicPaths = [
          "/api/v1/auth/register",
          "/api/v1/auth/login",
          "/api/v1/links",
          "/api/v1/questions",
          "/api/v1/assignments",
          "/api/v1/assignment-candidate-test",
        ];

        if (publicPaths.some((publicPath) => path.startsWith(publicPath))) {
          return;
        }

        const authHeader = headers["authorization"];
        if (!authHeader?.startsWith("Bearer ")) {
          set.status = 401;
          return { message: "Unauthorized: Missing or invalid token" };
        }

        try {
          const token = authHeader.split(" ")[1];
          const payload = await jwt.verify(token);

          if (!payload) {
            set.status = 401;
            return { message: "Unauthorized: Invalid token" };
          }

          (store as any).user = payload;
        } catch {
          set.status = 401;
          return { message: "Unauthorized: Token verification failed" };
        }
      })

      .use(authController.createRoutes())
      .use(organizationController.createRoutes())
      .use(userController.createRoutes())
      .use(healthController.createRoutes())
  )
  .onError(({ error, code, set }) => {
    switch (code) {
      case "VALIDATION":
        set.status = 400;
        return {
          message: "Validation error",
          error: error.message,
        };
      case "NOT_FOUND":
        set.status = 404;
        return {
          message: "Resource not found",
        };
      default:
        set.status = 500;
        return {
          message: "Internal server error",
        };
    }
  })
  .listen(process.env.PORT ?? 3000);

console.log(
  `🦊 Elysia API is running at ${app.server?.hostname}:${app.server?.port}`
);
