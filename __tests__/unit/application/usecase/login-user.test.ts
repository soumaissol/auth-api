import { EmptyInput, InvalidInput } from 'sms-api-commons';

import LoginUserOutput from '../../../../src/application/dto/output/login-user-output';
import LoginUser from '../../../../src/application/usecase/login-user';
import AuthSession from '../../../../src/domain/entity/auth-session';
import { buildFakeAuthGateway } from '../../utils/fake-auth-gateway';

describe('Test LoginUser usecase', () => {
  it('should return error when input is null', async () => {
    try {
      const loginUser = new LoginUser(buildFakeAuthGateway());
      await loginUser.execute(null);
    } catch (err) {
      expect(err).toEqual(new EmptyInput());
    }
  });

  it('should return error when input is empty object', async () => {
    try {
      const loginUser = new LoginUser(buildFakeAuthGateway());

      await loginUser.execute(JSON.stringify({}));
    } catch (err) {
      expect(err).toEqual(new InvalidInput('invalid email', 'invalid_email'));
    }
  });

  it('should return error when email is not valid', async () => {
    try {
      const loginUser = new LoginUser(buildFakeAuthGateway());

      await loginUser.execute(JSON.stringify({ email: 'my-email' }));
    } catch (err) {
      expect(err).toEqual(new InvalidInput('invalid email', 'invalid_email'));
    }
  });

  it('should return error when password is not valid', async () => {
    try {
      const loginUser = new LoginUser(buildFakeAuthGateway());

      await loginUser.execute(JSON.stringify({ email: 'myemail@email.com' }));
    } catch (err) {
      expect(err).toEqual(new InvalidInput('invalid password', 'invalid_password'));
    }
  });

  it('should return output when email and password are valid', async () => {
    const email = 'myemail@email.com';
    const password = 'MuPass@rowd';
    const authSession = new AuthSession('token', 'refreshToken', 1, null, 'session');
    const fakeAuthGateway = {
      ...buildFakeAuthGateway(),
      loginUser: jest.fn().mockResolvedValueOnce(authSession),
    };

    const loginUser = new LoginUser(fakeAuthGateway);

    const output = await loginUser.execute(JSON.stringify({ email, password }));
    expect(output).toEqual(
      new LoginUserOutput(
        authSession.token,
        authSession.refreshToken,
        authSession.expiresIn,
        authSession.challenge,
        authSession.session,
      ),
    );

    expect(fakeAuthGateway.loginUser).toHaveBeenCalledTimes(1);
    expect(fakeAuthGateway.loginUser.mock.calls[0][0]).toBe(email);
    expect(fakeAuthGateway.loginUser.mock.calls[0][1]).toBe(password);
  });
});
