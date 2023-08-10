import { EmptyInput, InvalidInput } from 'sms-api-commons';

import CreateUser from '../../../../src/application/usecase/create-user';
import { buildFakeAuthGateway } from '../../utils/fake-auth-gateway';

describe('Test CreateUser usecase', () => {
  it('should return error when input is null', async () => {
    try {
      const createUser = new CreateUser(buildFakeAuthGateway());
      await createUser.execute(null);
    } catch (err) {
      expect(err).toEqual(new EmptyInput());
    }
  });

  it('should return error when input is empty object', async () => {
    try {
      const createUser = new CreateUser(buildFakeAuthGateway());

      await createUser.execute(JSON.stringify({}));
    } catch (err) {
      expect(err).toEqual(new InvalidInput('invalid email', 'invalid_email'));
    }
  });

  it('should return error when email is not valid', async () => {
    try {
      const createUser = new CreateUser(buildFakeAuthGateway());

      await createUser.execute(JSON.stringify({ email: 'my-email' }));
    } catch (err) {
      expect(err).toEqual(new InvalidInput('invalid email', 'invalid_email'));
    }
  });

  it('should return auth user when logged user is valid', async () => {
    const email = 'myemail@email.com';
    const fakeAuthGateway = {
      ...buildFakeAuthGateway(),
      createUser: jest.fn().mockResolvedValueOnce(null),
    };

    const createUser = new CreateUser(fakeAuthGateway);

    const output = await createUser.execute(JSON.stringify({ email }));
    expect(output).toBeUndefined();

    expect(fakeAuthGateway.createUser).toHaveBeenCalledTimes(1);
    expect(fakeAuthGateway.createUser.mock.calls[0][0]).toBe(email);
  });
});
