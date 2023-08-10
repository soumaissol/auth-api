import UserNewPassword from '../../../../src/domain/entity/user-new-password';
import InvalidNewPassword from '../../../../src/domain/errors/invalid-new-password';

describe('Test UserNewPassword', () => {
  it('should throw error when password doesnt match', () => {
    try {
      new UserNewPassword('pass', 'password');
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toEqual(new InvalidNewPassword('passwords dont match'));
    }
  });

  it('should throw error when password is too short', () => {
    try {
      new UserNewPassword('pass', 'pass');
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toEqual(new InvalidNewPassword('password length must be greater than 6'));
    }
  });

  it('should throw error when password without digit', () => {
    try {
      new UserNewPassword('password', 'password');
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toEqual(new InvalidNewPassword('password must have a digit'));
    }
  });

  it('should throw error when password without lower case', () => {
    try {
      new UserNewPassword('PASSWORD2', 'PASSWORD2');
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toEqual(new InvalidNewPassword('password must have a lower case'));
    }
  });

  it('should throw error when password without upper case', () => {
    try {
      new UserNewPassword('password2', 'password2');
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toEqual(new InvalidNewPassword('password must have a upper case'));
    }
  });

  it('should throw error when password without symbol', () => {
    try {
      new UserNewPassword('Password2', 'Password2');
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toEqual(new InvalidNewPassword('password must have a symbol'));
    }
  });

  it('should create object when password is valid', () => {
    const userNewPassword = new UserNewPassword('Password2@', 'Password2@');
    expect(userNewPassword.password).toBe('Password2@');
  });
});
