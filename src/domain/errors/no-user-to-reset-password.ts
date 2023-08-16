import { GenericError } from 'sms-api-commons';

export default class NoUserToResetPassword extends GenericError {
  constructor() {
    super('no user to reset password', 'no_user_to_reset_password', true);
  }
}
