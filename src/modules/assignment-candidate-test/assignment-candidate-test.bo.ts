export interface AssignmentCandidateTestBO {
  id: string;
  type: string;
  name: string;
  description?: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAssignmentCandidateTestRequestBO {
  type: string;
  name: string;
  description?: string;
  language?: string;
}

export interface UpdateAssignmentCandidateTestRequestBO {
  type?: string;
  name?: string;
  description?: string;
  language?: string;
}

export interface AssignmentCandidateTestListResponseBO {
  tests: AssignmentCandidateTestBO[];
  total: number;
  page: number;
  limit: number;
}
