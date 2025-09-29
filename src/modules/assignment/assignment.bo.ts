import { AssignmentCandidateBO } from "../assignment-candidate/assignment-candidate.bo";
import { OrganizationBO } from "../organization/organization.bo";
import {
  AssignmentTestBO,
  Status,
} from "../assignment-test/assignment-test.bo";

export interface AssignmentBO {
  id: string;
  code: string;
  assignmentCandidateId: string;
  folderId?: string;
  isArchive: boolean;
  assignmentCandidate?: AssignmentCandidateBO;
  folder?: OrganizationBO;
  assignmentTest?: AssignmentTestBO;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAssignmentRequestBO {
  assignmentCandidate: {
    fullname: string;
    age?: number;
    gender?: "MALE" | "FEMALE";
    companyId?: string;
    phone?: string;
    telegram?: string;
    email?: string;
    city?: string;
    countryCode?: string;
  };
  folderId?: string;
  isArchive?: boolean;
  assignmentTest?: {
    testId?: string;
    sendDate?: Date;
    status?: Status;
    count?: number;
    markedCount?: number;
  };
}

export interface UpdateAssignmentRequestBO {
  isArchive: boolean;
}

export interface AssignmentListResponseBO {
  assignments: AssignmentBO[];
  total: number;
  page: number;
  limit: number;
}
