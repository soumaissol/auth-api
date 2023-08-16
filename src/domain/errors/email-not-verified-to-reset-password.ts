import { GenericError } from 'sms-api-commons';

export default class EmailNotVerifiedToResetPassword extends GenericError {
  constructor() {
    super('email not verified to reset password', 'email_not_verified_to_reset_password', true);
  }
}
