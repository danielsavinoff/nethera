export interface GrantSubscriptionCommand {
  subscriptionId: string;
}

export interface GrantSubscriptionResult {
  data: Record<string, never>;
}

export class GrantSubscriptionUseCase {
  execute(
    command: GrantSubscriptionCommand,
  ): Promise<GrantSubscriptionResult> {
    void command;

    return Promise.resolve({
      data: {},
    });
  }
}
