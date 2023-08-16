import * as jf from 'joiful';
import { InvalidInput, safelyParseData } from 'sms-api-commons';

export default class ConfirmUserResetPasswordInput {
  @jf.string().email().required().error(new InvalidInput('invalid email', 'invalid_email'))
  public email: string;

  @jf.string().required().error(new InvalidInput('invalid password', 'invalid_password'))
  public password: string;

  @jf.string().required().error(new InvalidInput('invalid confirm password', 'invalid_confirm_password'))
  public confirmPassword: string;

  @jf.string().required().error(new InvalidInput('invalid confirmation code', 'invalid_confirmation_code'))
  public confirmationCode: string;

  constructor(input: any) {
    const inputData = safelyParseData(input);

    this.email = inputData.email;
    this.password = inputData.password;
    this.confirmPassword = inputData.confirmPassword;
    this.confirmationCode = inputData.confirmationCode;
  }
}
