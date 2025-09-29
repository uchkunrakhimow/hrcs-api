export type Role = "ADMIN" | "USER";

export interface UserBO {
  id: string;
  email: string;
  name: string;
  role: Role;
  organizationId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequestBO {
  email: string;
  name: string;
  role?: Role;
  password: string;
  organizationId?: string | null;
}

export interface UpdateUserRequestBO {
  email?: string;
  name?: string;
  role?: Role;
  password?: string;
  organizationId?: string | null;
}

export interface UserListResponseBO {
  users: UserBO[];
  total: number;
  page: number;
  limit: number;
}
