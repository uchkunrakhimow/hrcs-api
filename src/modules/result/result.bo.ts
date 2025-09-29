export interface ResultBO {
  language: string;
  fullName: string;
  age: number;
  gender: string;
  percents: {
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;
    g: number;
    h: number;
    i: number;
    j: number;
  };
  score: {
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;
    g: number;
    h: number;
    i: number;
    j: number;
  };
  canceled: {
    e?: number;
  };
  doubt: number;
  sendDate: string;
  testType: string;
}

export interface CandidateAnswerBO {
  id: string;
  assignmentId: string;
  questionId: string;
  answerId: string;
  percents?: {
    a?: number;
    b?: number;
    c?: number;
    d?: number;
    e?: number;
    f?: number;
    g?: number;
    h?: number;
    i?: number;
    j?: number;
  };
}

export interface AssignmentCandidateBO {
  id: string;
  fullname: string;
  age: number | null;
  gender: string | null;
  companyId: string | null;
  phone: string | null;
  telegram: string | null;
  email: string | null;
  city: string | null;
  countryCode: string | null;
  link: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssignmentTestBO {
  id: string;
  testId: string | null;
  sendDate: Date | null;
  status: string | null;
  count: number | null;
  markedCount: number | null;
  createdAt: Date;
  updatedAt: Date;
}
