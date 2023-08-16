import { convertAndValidateInput } from 'sms-api-commons';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import AuthGateway from '../../infra/auth-gateway/auth-gateway';
import LoginUserInput from '../dto/input/login-user-input';
import LoginUserOutput from '../dto/output/login-user-output';

export default class LoginUser {
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
