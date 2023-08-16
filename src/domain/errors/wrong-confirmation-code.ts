import { GenericError } from 'sms-api-commons';

export default class WrongConfirmationCode extends GenericError {
  constructor() {
    super('wrong confirmation code', 'wrong_confirmation_code', true);
  }
}
