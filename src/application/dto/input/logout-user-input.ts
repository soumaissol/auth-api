import * as jf from 'joiful';
import { InvalidInput, safelyParseData } from 'sms-api-commons';

export default class LogoutUserInput {
  @jf.string().required().error(new InvalidInput('invalid id', 'invalid_id'))
  public id: string;

  constructor(input: any) {
    const inputData = safelyParseData(input);

    this.id = inputData.id;
  }
}
