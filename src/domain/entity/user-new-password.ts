import InvalidNewPassword from '../errors/invalid-new-password';

export default class UserNewPassword {
  constructor(
    readonly password: string,
    confirmPassword: string,
  ) {
    if (password !== confirmPassword) {
      throw new InvalidNewPassword('passwords dont match');
    }

    if (password.length < 6) {
      throw new InvalidNewPassword('password length must be greater than 6');
    }

    if (password.match(/\d+/) === null) {
      throw new InvalidNewPassword('password must have a digit');
    }

    if (password.match(/[a-z]+/) === null) {
      throw new InvalidNewPassword('password must have a lower case');
    }

    if (password.match(/[A-Z]+/) === null) {
      throw new InvalidNewPassword('password must have a upper case');
    }

    if (password.match(/[^A-Za-z0-9]+/) === null) {
      throw new InvalidNewPassword('password must have a symbol');
    }
  }
}
