import { User } from '../../domain/user/User.js';
import { UserRecord } from '../../domain/user/UserRecord.js';
import { UserNotFoundException } from '../exceptions/UserNotFoundException.js';
import { UserRepository } from '../ports/UserRepository.js';

export interface GetCurrentUserCommand {
  userId: UserRecord['id'];
}

export interface GetCurrentUserResult {
  user: User;
}

export class GetCurrentUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    command: GetCurrentUserCommand,
  ): Promise<GetCurrentUserResult> {
    const user = await this.userRepository.findByIdWithRoles(
      command.userId,
    );

    if (!user) {
      throw new UserNotFoundException();
    }

    return {
      user: user,
    };
  }
}
