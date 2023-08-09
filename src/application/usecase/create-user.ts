import { convertAndValidateInput } from 'sms-api-commons';

import AuthGateway from '../../infra/auth-gateway/auth-gateway';
import CreateUserInput from '../dto/input/create-user-input';

export default class CreateUser {
  constructor(readonly authGateway: AuthGateway) {}

  async execute(input: any): Promise<void> {
    const validInput = convertAndValidateInput<CreateUserInput>(input, new CreateUserInput(input));

    await this.authGateway.createUser(validInput.email);
  }
}
