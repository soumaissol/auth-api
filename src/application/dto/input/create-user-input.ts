import * as jf from 'joiful';

import InvalidInput from '../../errors/invalid-input';
import { safelyParseData } from './common-input';

export default class CreateUserInput {
  @jf.string().email().required().error(new InvalidInput('invalid email', 'invalid_email'))
  public email: string;

  constructor(input: any) {
    const inputData = safelyParseData(input);

    this.email = inputData.email;
  }
}
