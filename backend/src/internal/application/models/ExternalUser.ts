export interface ExternalUser {
  externalId: number;
  firstName?: string;
  secondName?: string;
  lastName?: string;
  isAdmin: boolean;
  isActive?: boolean;
  externalDepartmentIds: string[];
}
