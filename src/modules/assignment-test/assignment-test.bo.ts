import { AssignmentCandidateTestBO } from "../assignment-candidate-test/assignment-candidate-test.bo";

export type Status = "finished" | "started" | "not_started";

export interface AssignmentTestBO {
  id: string;
  testId?: string;
  sendDate?: Date;
  status?: Status;
  count?: number;
  markedCount?: number;
  assignmentId?: string;
  test?: AssignmentCandidateTestBO;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAssignmentTestRequestBO {
  testId?: string;
  sendDate?: Date;
  status?: Status;
  count?: number;
  markedCount?: number;
  assignmentId?: string;
}

export interface UpdateAssignmentTestRequestBO {
  testId?: string;
  sendDate?: Date;
  status?: Status;
  count?: number;
  markedCount?: number;
  assignmentId?: string;
}

export interface AssignmentTestListResponseBO {
  tests: AssignmentTestBO[];
  total: number;
  page: number;
  limit: number;
}
