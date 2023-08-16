import { GenericError } from 'sms-api-commons';

export default class MustCreatePasswordFirst extends GenericError {
  constructor() {
    super('must create password first', 'must_create_password_first', true);
  }
}
