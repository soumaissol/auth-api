import * as jf from 'joiful';
import { InvalidInput, safelyParseData } from 'sms-api-commons';

export default class ResetUserPasswordInput {
  @jf.string().email().required().error(new InvalidInput('invalid email', 'invalid_email'))
  public email: string;

  constructor(input: any) {
    const inputData = safelyParseData(input);

    this.email = inputData.email;
  }
}
