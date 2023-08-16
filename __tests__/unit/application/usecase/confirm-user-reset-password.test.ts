import { EmptyInput, InvalidInput } from 'sms-api-commons';

import ConfirmUserResetPassword from '../../../../src/application/usecase/confirm-user-reset-password';
import { buildFakeAuthGateway } from '../../utils/fake-auth-gateway';

describe('Test ConfirmUserResetPassword usecase', () => {
  it('should return error when input is null', async () => {
    try {
      const confirmUserResetPassword = new ConfirmUserResetPassword(buildFakeAuthGateway());
      await confirmUserResetPassword.execute(null);
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toEqual(new EmptyInput());
    }
  });

  it('should return error when input is empty object', async () => {
    try {
      const confirmUserResetPassword = new ConfirmUserResetPassword(buildFakeAuthGateway());

      await confirmUserResetPassword.execute(JSON.stringify({}));
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toEqual(new InvalidInput('invalid email', 'invalid_email'));
    }
  });

  it('should return error when email is not valid', async () => {
    try {
      const confirmUserResetPassword = new ConfirmUserResetPassword(buildFakeAuthGateway());

      await confirmUserResetPassword.execute(JSON.stringify({ email: 'my-email' }));
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toEqual(new InvalidInput('invalid email', 'invalid_email'));
    }
  });

  it('should return error when password is not valid', async () => {
    try {
      const confirmUserResetPassword = new ConfirmUserResetPassword(buildFakeAuthGateway());

      await confirmUserResetPassword.execute(JSON.stringify({ email: 'myemail@email.com' }));
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toEqual(new InvalidInput('invalid password', 'invalid_password'));
    }
  });

  it('should return error when confirm password is not valid', async () => {
    try {
      const confirmUserResetPassword = new ConfirmUserResetPassword(buildFakeAuthGateway());

      await confirmUserResetPassword.execute(JSON.stringify({ email: 'myemail@email.com', password: 'MuPass@rowd' }));
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toEqual(new InvalidInput('invalid confirm password', 'invalid_confirm_password'));
    }
  });

  it('should return error when confirmation code is not valid', async () => {
    try {
      const confirmUserResetPassword = new ConfirmUserResetPassword(buildFakeAuthGateway());

      await confirmUserResetPassword.execute(
        JSON.stringify({ email: 'myemail@email.com', password: 'MuPass@rowd', confirmPassword: 'Pass@rowd' }),
      );
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toEqual(new InvalidInput('invalid confirmation code', 'invalid_confirmation_code'));
    }
  });

  it('should return error when passwords are not equal', async () => {
    try {
      const confirmUserResetPassword = new ConfirmUserResetPassword(buildFakeAuthGateway());

      await confirmUserResetPassword.execute(
        JSON.stringify({
          email: 'myemail@email.com',
          password: 'MuPass@rowd',
          confirmPassword: 'Pass@rowd',
          confirmationCode: 'my-code',
        }),
      );
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toEqual(new InvalidInput('passwords dont match', 'invalid_new_password'));
    }
  });

  it('should return void when email and password are valid', async () => {
    const email = 'myemail@email.com';
    const password = 'MuPass@rowd1';
    const confirmationCode = 'my-code';
    const fakeAuthGateway = {
      ...buildFakeAuthGateway(),
      confirmResetPassword: jest.fn().mockResolvedValueOnce(null),
    };

    const confirmUserResetPassword = new ConfirmUserResetPassword(fakeAuthGateway);

    await confirmUserResetPassword.execute(
      JSON.stringify({ email, password, confirmPassword: password, confirmationCode }),
    );

    expect(fakeAuthGateway.confirmResetPassword).toHaveBeenCalledTimes(1);
    expect(fakeAuthGateway.confirmResetPassword.mock.calls[0][0]).toBe(email);
    expect(fakeAuthGateway.confirmResetPassword.mock.calls[0][1]).toBe(confirmationCode);
    expect(fakeAuthGateway.confirmResetPassword.mock.calls[0][2]).toBe(password);
  });
});
