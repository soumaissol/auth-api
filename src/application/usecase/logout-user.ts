import { convertAndValidateInput } from 'sms-api-commons';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import AuthGateway from '../../infra/auth-gateway/auth-gateway';
import LogoutUserInput from '../dto/input/logout-user-input';

export default class LogoutUser {
  constructor(readonly authGateway: AuthGateway) {}

  async execute(input: any): Promise<void> {
    const validInput = convertAndValidateInput<LogoutUserInput>(input, new LogoutUserInput(input));

    await this.authGateway.logout(validInput.id);
  }
}
