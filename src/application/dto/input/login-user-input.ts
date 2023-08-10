import * as jf from 'joiful';
import { InvalidInput, safelyParseData } from 'sms-api-commons';

export default class LoginUserInput {
  @jf.string().email().required().error(new InvalidInput('invalid email', 'invalid_email'))
  public email: string;

  @jf.string().required().error(new InvalidInput('invalid password', 'invalid_password'))
  public password: string;

  constructor(input: any) {
    const inputData = safelyParseData(input);

    this.email = inputData.email;
    this.password = inputData.password;
  }
}
