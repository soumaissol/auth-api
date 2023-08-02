import EmptyInput from '../../../../src/application/errors/empty-input';
import InvalidInput from '../../../../src/application/errors/invalid-input';
import CreateUser from '../../../../src/application/usecase/create-user';
import type AuthGateway from '../../../../src/infra/auth-gateway/auth-gateway';

const buildFakeAuthGateway = (): AuthGateway => {
  return {
    getUser: jest.fn(),
    createUser: jest.fn(),
  };
};

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
