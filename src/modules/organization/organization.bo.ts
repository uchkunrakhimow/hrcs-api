export interface OrganizationBO {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrganizationRequestBO {
  name: string;
}

export interface UpdateOrganizationRequestBO {
  name?: string;
}

export interface OrganizationListResponseBO {
  organizations: OrganizationBO[];
  total: number;
  page: number;
  limit: number;
}
