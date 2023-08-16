import { convertAndValidateInput } from 'sms-api-commons';

import UserNewPassword from '../../domain/entity/user-new-password';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import AuthGateway from '../../infra/auth-gateway/auth-gateway';
import ConfirmUserResetPasswordInput from '../dto/input/confirm-user-reset-password-input';

export default class ConfirmUserResetPassword {
  constructor(readonly authGateway: AuthGateway) {}

  async execute(input: any): Promise<void> {
    const validInput = convertAndValidateInput<ConfirmUserResetPasswordInput>(
      input,
      new ConfirmUserResetPasswordInput(input),
    );

    await this.authGateway.confirmResetPassword(
      validInput.email,
      validInput.confirmationCode,
      new UserNewPassword(validInput.password, validInput.confirmPassword).password,
    );
  }
}
