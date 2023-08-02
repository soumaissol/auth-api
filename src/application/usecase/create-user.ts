import AuthGateway from '../../infra/auth-gateway/auth-gateway';
import { convertAndValidateInput } from '../dto/input/common-input';
import CreateUserInput from '../dto/input/create-user-input';

export default class CreateUser {
  constructor(readonly authGateway: AuthGateway) {}

  async execute(input: any): Promise<void> {
    const validInput = convertAndValidateInput<CreateUserInput>(input, new CreateUserInput(input));

    await this.authGateway.createUser(validInput.email);
  }
}
