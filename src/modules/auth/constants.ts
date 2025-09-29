export const AUTH_CONSTANTS = {
  DEFAULT_ROLE: "USER",
  ERROR_MESSAGES: {
    REGISTRATION_FAILED: "Registration failed",
    LOGIN_FAILED: "Login failed",
    AUTHENTICATION_FAILED: "Authentication failed",
    NO_TOKEN_PROVIDED: "No token provided",
    INVALID_TOKEN: "Invalid token",
    USER_NOT_FOUND: "User not found",
    EMAIL_EXISTS: "User with this email already exists",
    INVALID_CREDENTIALS: "Invalid credentials",
  },
  HTTP_STATUS: {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
  },
} as const;
