export class QuestionNotFoundError extends Error {
  constructor(questionId: string) {
    super(`Question with id ${questionId} not found`);
    this.name = "QuestionNotFoundError";
  }
}

export class AnswerNotFoundError extends Error {
  constructor(answerId: string) {
    super(`Answer with id ${answerId} not found`);
    this.name = "AnswerNotFoundError";
  }
}

export class AssignmentNotFoundError extends Error {
  constructor(assignmentId: string) {
    super(`Assignment with id ${assignmentId} not found`);
    this.name = "AssignmentNotFoundError";
  }
}

export class AssignmentTestNotFoundError extends Error {
  constructor(assignmentTestId: string) {
    super(`AssignmentTest with id ${assignmentTestId} not found`);
    this.name = "AssignmentTestNotFoundError";
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}
