import { EmptyInput, InvalidInput } from 'sms-api-commons';

import ResetUserPassword from '../../../../src/application/usecase/reset-user-password';
import { buildFakeAuthGateway } from '../../utils/fake-auth-gateway';

describe('Test ResetUserPassword usecase', () => {
  it('should return error when input is null', async () => {
    try {
      const resetUserPassword = new ResetUserPassword(buildFakeAuthGateway());
      await resetUserPassword.execute(null);
    } catch (err) {
      expect(err).toEqual(new EmptyInput());
    }
  });

  it('should return error when input is empty object', async () => {
    try {
      const resetUserPassword = new ResetUserPassword(buildFakeAuthGateway());

      await resetUserPassword.execute(JSON.stringify({}));
    } catch (err) {
      expect(err).toEqual(new InvalidInput('invalid email', 'invalid_email'));
    }
  });

  it('should return error when email is not valid', async () => {
    try {
      const resetUserPassword = new ResetUserPassword(buildFakeAuthGateway());

      await resetUserPassword.execute(JSON.stringify({ email: 'my-email' }));
    } catch (err) {
      expect(err).toEqual(new InvalidInput('invalid email', 'invalid_email'));
    }
  });

  it('should return void when email is valid', async () => {
    const email = 'myemail@email.com';
    const fakeAuthGateway = {
      ...buildFakeAuthGateway(),
      resetUserPassword: jest.fn().mockResolvedValueOnce(null),
    };

    const resetUserPassword = new ResetUserPassword(fakeAuthGateway);

    await resetUserPassword.execute(JSON.stringify({ email }));

    expect(fakeAuthGateway.resetUserPassword).toHaveBeenCalledTimes(1);
    expect(fakeAuthGateway.resetUserPassword.mock.calls[0][0]).toBe(email);
  });
});
