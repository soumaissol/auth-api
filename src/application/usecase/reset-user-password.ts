import { convertAndValidateInput } from 'sms-api-commons';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import AuthGateway from '../../infra/auth-gateway/auth-gateway';
import ResetUserPasswordInput from '../dto/input/reset-user-password-input';

export default class ResetUserPassword {
  constructor(readonly authGateway: AuthGateway) {}

  async execute(input: any): Promise<void> {
    const validInput = convertAndValidateInput<ResetUserPasswordInput>(input, new ResetUserPasswordInput(input));

    await this.authGateway.resetUserPassword(validInput.email);
  }
}
