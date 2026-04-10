export interface ExternalUser {
  id: number;
  firstName?: string;
  secondName?: string;
  lastName?: string;
  isAdmin: boolean;
  isActive?: boolean;
  departmentIds: string[];
}
