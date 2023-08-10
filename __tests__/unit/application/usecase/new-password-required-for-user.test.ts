import { EmptyInput, InvalidInput } from 'sms-api-commons';

// eslint-disable-next-line max-len
import NewPasswordRequiredForUserOutput from '../../../../src/application/dto/output/new-password-required-for-user-output';
import NewPasswordRequiredForUser from '../../../../src/application/usecase/new-password-required-for-user';
import AuthSession from '../../../../src/domain/entity/auth-session';
import { buildFakeAuthGateway } from '../../utils/fake-auth-gateway';

describe('Test NewPasswordRequiredForUser usecase', () => {
  it('should return error when input is null', async () => {
    try {
      const newPasswordRequiredForUser = new NewPasswordRequiredForUser(buildFakeAuthGateway());
      await newPasswordRequiredForUser.execute(null);
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toEqual(new EmptyInput());
    }
  });

  it('should return error when input is empty object', async () => {
    try {
      const newPasswordRequiredForUser = new NewPasswordRequiredForUser(buildFakeAuthGateway());

      await newPasswordRequiredForUser.execute(JSON.stringify({}));
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toEqual(new InvalidInput('invalid email', 'invalid_email'));
    }
  });

  it('should return error when email is not valid', async () => {
    try {
      const newPasswordRequiredForUser = new NewPasswordRequiredForUser(buildFakeAuthGateway());

      await newPasswordRequiredForUser.execute(JSON.stringify({ email: 'my-email' }));
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toEqual(new InvalidInput('invalid email', 'invalid_email'));
    }
  });

  it('should return error when password is not valid', async () => {
    try {
      const newPasswordRequiredForUser = new NewPasswordRequiredForUser(buildFakeAuthGateway());

      await newPasswordRequiredForUser.execute(JSON.stringify({ email: 'myemail@email.com' }));
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toEqual(new InvalidInput('invalid password', 'invalid_password'));
    }
  });

  it('should return error when confirm password is not valid', async () => {
    try {
      const newPasswordRequiredForUser = new NewPasswordRequiredForUser(buildFakeAuthGateway());

      await newPasswordRequiredForUser.execute(JSON.stringify({ email: 'myemail@email.com', password: 'MuPass@rowd' }));
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toEqual(new InvalidInput('invalid confirm password', 'invalid_confirm_password'));
    }
  });

  it('should return error when confirm session is not valid', async () => {
    try {
      const newPasswordRequiredForUser = new NewPasswordRequiredForUser(buildFakeAuthGateway());

      await newPasswordRequiredForUser.execute(
        JSON.stringify({ email: 'myemail@email.com', password: 'MuPass@rowd', confirmPassword: 'Pass@rowd' }),
      );
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toEqual(new InvalidInput('invalid session', 'invalid_session'));
    }
  });

  it('should return error when passwords are not equal', async () => {
    try {
      const newPasswordRequiredForUser = new NewPasswordRequiredForUser(buildFakeAuthGateway());

      await newPasswordRequiredForUser.execute(
        JSON.stringify({
          email: 'myemail@email.com',
          password: 'MuPass@rowd',
          confirmPassword: 'Pass@rowd',
          session: 'my-session',
        }),
      );
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toEqual(new InvalidInput('passwords dont match', 'invalid_new_password'));
    }
  });

  it('should return output when email and password are valid', async () => {
    const email = 'myemail@email.com';
    const password = 'MuPass@rowd1';
    const session = 'my-session';
    const authSession = new AuthSession('token', 'refreshToken', 1, null, 'session');
    const fakeAuthGateway = {
      ...buildFakeAuthGateway(),
      respondToAuthChallenge: jest.fn().mockResolvedValueOnce(authSession),
    };

    const newPasswordRequiredForUser = new NewPasswordRequiredForUser(fakeAuthGateway);

    const output = await newPasswordRequiredForUser.execute(
      JSON.stringify({ email, password, confirmPassword: password, session }),
    );
    expect(output).toEqual(
      new NewPasswordRequiredForUserOutput(
        authSession.token,
        authSession.refreshToken,
        authSession.expiresIn,
        authSession.challenge,
        authSession.session,
      ),
    );

    expect(fakeAuthGateway.respondToAuthChallenge).toHaveBeenCalledTimes(1);
    expect(fakeAuthGateway.respondToAuthChallenge.mock.calls[0][0]).toBe(email);
    expect(fakeAuthGateway.respondToAuthChallenge.mock.calls[0][1]).toBe(password);
    expect(fakeAuthGateway.respondToAuthChallenge.mock.calls[0][2]).toBe(session);
  });
});
