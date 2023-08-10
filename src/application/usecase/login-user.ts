import { convertAndValidateInput } from 'sms-api-commons';

import AuthGateway from '../../infra/auth-gateway/auth-gateway';
import LoginUserInput from '../dto/input/login-user-input';
import LoginUserOutput from '../dto/output/login-user-output';

export default class LoginUSer {
  constructor(readonly authGateway: AuthGateway) {}

  async execute(input: any): Promise<LoginUserOutput> {
    const validInput = convertAndValidateInput<LoginUserInput>(input, new LoginUserInput(input));

    const authSession = await this.authGateway.loginUser(validInput.email, validInput.password);
    return new LoginUserOutput(
      authSession.token,
      authSession.refreshToken,
      authSession.expiresIn,
      authSession.challenge,
      authSession.session,
    );
  }
}
