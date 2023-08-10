import { convertAndValidateInput } from 'sms-api-commons';

import UserNewPassword from '../../domain/entity/user-new-password';
import AuthGateway from '../../infra/auth-gateway/auth-gateway';
import NewPasswordRequiredForUserInput from '../dto/input/new-password-required-for-user-input';
import NewPasswordRequiredForUserOutput from '../dto/output/new-password-required-for-user-output';

export default class NewPasswordRequiredForUser {
  constructor(readonly authGateway: AuthGateway) {}

  async execute(input: any): Promise<NewPasswordRequiredForUserOutput> {
    const validInput = convertAndValidateInput<NewPasswordRequiredForUserInput>(
      input,
      new NewPasswordRequiredForUserInput(input),
    );

    const authSession = await this.authGateway.respondToAuthChallenge(
      validInput.email,
      new UserNewPassword(validInput.password, validInput.confirmPassword).password,
      validInput.session,
    );

    return new NewPasswordRequiredForUserOutput(
      authSession.token,
      authSession.refreshToken,
      authSession.expiresIn,
      authSession.challenge,
      authSession.session,
    );
  }
}
