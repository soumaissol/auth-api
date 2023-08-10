import { GenericError } from 'sms-api-commons';

export default class InvalidNewPassword extends GenericError {
  constructor(message: string) {
    super(message, 'invalid_new_password', true);
  }
}
