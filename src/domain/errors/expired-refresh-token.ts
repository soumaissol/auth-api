import { GenericError } from 'sms-api-commons';

export default class ExpiredRefreshToken extends GenericError {
  constructor() {
    super('expired refresh token', 'expired_refresh_token', true);
  }
}
