export type Gender = "MALE" | "FEMALE";

export interface AssignmentCandidateBO {
  id: string;
  fullname: string;
  age?: number;
  gender?: Gender;
  companyId?: string;
  phone?: string;
  telegram?: string;
  email?: string;
  city?: string;
  link?: string;
  countryCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAssignmentCandidateRequestBO {
  fullname: string;
  age?: number;
  gender?: Gender;
  companyId?: string;
  phone?: string;
  telegram?: string;
  email?: string;
  city?: string;
  link?: string;
  countryCode?: string;
}

export interface UpdateAssignmentCandidateRequestBO {
  fullname?: string;
  age?: number;
  gender?: Gender;
  companyId?: string;
  phone?: string;
  telegram?: string;
  email?: string;
  city?: string;
  countryCode?: string;
}

export interface AssignmentCandidateListResponseBO {
  candidates: AssignmentCandidateBO[];
  total: number;
  page: number;
  limit: number;
}
