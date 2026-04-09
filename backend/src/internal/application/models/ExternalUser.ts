export interface ExternalUser {
  id: number;
  firstName?: string;
  secondName?: string;
  lastName?: string;
  isActive?: boolean;
  departmentIds: string[];
}
