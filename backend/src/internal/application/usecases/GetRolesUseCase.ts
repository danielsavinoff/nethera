import { Role } from '../../domain/authorization/Role.js';
import type { RoleRepository } from '../ports/RoleRepository.js';

export interface GetRolesResult {
  roles: Role[];
}

export class GetRolesUseCase {
  constructor(private readonly roleRepository: RoleRepository) {}

  async execute(): Promise<GetRolesResult> {
    const roles = await this.roleRepository.loadAll();

    return {
      roles: roles,
    };
  }
}
