export interface QuestionBO {
  id: string;
  text: string;
  number: number;
  testId: string | null;
  answers: AnswerBO[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AnswerBO {
  id: string;
  text: string;
  marked: boolean;
}

export interface UpdateQuestionRequestBO {
  assignmentId: string;
  answerId: string;
}
