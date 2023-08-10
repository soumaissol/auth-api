import { GenericError } from 'sms-api-commons';

export default class IncorrectEmailOrPassword extends GenericError {
  constructor() {
    super('incorrect email or password', 'incorrect_email_or_password', true);
  }
}
