import { EmptyInput, InvalidInput } from 'sms-api-commons';

import RefreshUserSessionOutput from '../../../../src/application/dto/output/refresh-user-session-output';
import RefreshUserSession from '../../../../src/application/usecase/refresh-user-session';
import AuthSession from '../../../../src/domain/entity/auth-session';
import { buildFakeAuthGateway } from '../../utils/fake-auth-gateway';

describe('Test RefreshUserSession usecase', () => {
  it('should return error when input is null', async () => {
    try {
      const refreshUserSession = new RefreshUserSession(buildFakeAuthGateway());
      await refreshUserSession.execute(null);
    } catch (err) {
      expect(err).toEqual(new EmptyInput());
    }
  });

  it('should return error when input is empty object', async () => {
    try {
      const refreshUserSession = new RefreshUserSession(buildFakeAuthGateway());

      await refreshUserSession.execute(JSON.stringify({}));
    } catch (err) {
      expect(err).toEqual(new InvalidInput('invalid refresh token', 'invalid_refresh_token'));
    }
  });

  it('should return output when inputs are valid', async () => {
    const refreshToken = 'fake.token';
    const authSession = new AuthSession('token', 'refreshToken', 1, null, 'session');
    const fakeAuthGateway = {
      ...buildFakeAuthGateway(),
      refreshSession: jest.fn().mockResolvedValueOnce(authSession),
    };

    const refreshUserSession = new RefreshUserSession(fakeAuthGateway);

    const output = await refreshUserSession.execute(JSON.stringify({ refreshToken }));
    expect(output).toEqual(
      new RefreshUserSessionOutput(
        authSession.token,
        authSession.refreshToken,
        authSession.expiresIn,
        authSession.challenge,
        authSession.session,
      ),
    );

    expect(fakeAuthGateway.refreshSession).toHaveBeenCalledTimes(1);
    expect(fakeAuthGateway.refreshSession.mock.calls[0][0]).toBe(refreshToken);
  });
});
