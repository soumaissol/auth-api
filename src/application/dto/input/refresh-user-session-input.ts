import * as jf from 'joiful';
import { InvalidInput, safelyParseData } from 'sms-api-commons';

export default class RefreshUserSessionInput {
  @jf.string().required().error(new InvalidInput('invalid refresh token', 'invalid_refresh_token'))
  public refreshToken: string;

  constructor(input: any) {
    const inputData = safelyParseData(input);

    this.refreshToken = inputData.refreshToken;
  }
}
