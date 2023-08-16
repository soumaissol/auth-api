import { EmptyInput, InvalidInput } from 'sms-api-commons';

import LogoutUser from '../../../../src/application/usecase/logout-user';
import { buildFakeAuthGateway } from '../../utils/fake-auth-gateway';

describe('Test LogoutUser usecase', () => {
  it('should return error when input is null', async () => {
    try {
      const logoutUser = new LogoutUser(buildFakeAuthGateway());
      await logoutUser.execute(null);
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toEqual(new EmptyInput());
    }
  });

  it('should return error when input is empty object', async () => {
    try {
      const logoutUser = new LogoutUser(buildFakeAuthGateway());

      await logoutUser.execute(JSON.stringify({}));
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toEqual(new InvalidInput('invalid id', 'invalid_id'));
    }
  });

  it('should return output when email and password are valid', async () => {
    const id = 'my-id';
    const fakeAuthGateway = {
      ...buildFakeAuthGateway(),
      logout: jest.fn().mockResolvedValueOnce(undefined),
    };
    const logoutUser = new LogoutUser(fakeAuthGateway);

    const output = await logoutUser.execute(JSON.stringify({ id }));
    expect(output).toBeUndefined();

    expect(fakeAuthGateway.logout).toHaveBeenCalledTimes(1);
    expect(fakeAuthGateway.logout.mock.calls[0][0]).toBe(id);
  });
});
0;
