import { convertAndValidateInput } from 'sms-api-commons';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import AuthGateway from '../../infra/auth-gateway/auth-gateway';
import CreateUserInput from '../dto/input/create-user-input';

export default class CreateUser {
  constructor(readonly authGateway: AuthGateway) {}

  async execute(input: any): Promise<void> {
    const validInput = convertAndValidateInput<CreateUserInput>(input, new CreateUserInput(input));

    await this.authGateway.createUser(validInput.email);
  }
}
