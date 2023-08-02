import GetMyUserOutput from '../../../../src/application/dto/output/get-my-user-output';
import GetMyUser from '../../../../src/application/usecase/get-my-user';
import AuthUser from '../../../../src/domain/entity/auth-user';
import LoggedUser from '../../../../src/domain/entity/logged-user';
import type AuthGateway from '../../../../src/infra/auth-gateway/auth-gateway';

const buildFakeAuthGateway = (): AuthGateway => {
  return {
    getUser: jest.fn(),
  };
};

describe('Test GetMyUser usecase', () => {
  it('should return null when logged user is null', async () => {
    const fakeAuthGateway = buildFakeAuthGateway();

    const getMyUser = new GetMyUser(fakeAuthGateway);

    const output = await getMyUser.execute(null);
    expect(output).toBeNull();

    expect(fakeAuthGateway.getUser).toHaveBeenCalledTimes(0);
  });

  it('should return auth user when logged user is valid', async () => {
    const loggedUser = new LoggedUser('fake.token');
    const authUser = new AuthUser('user-id-1', 'fake@email.com');
    const fakeAuthGateway = {
      ...buildFakeAuthGateway(),
      getUser: jest.fn().mockResolvedValueOnce(authUser),
    };

    const getMyUser = new GetMyUser(fakeAuthGateway);

    const output = await getMyUser.execute(loggedUser);
    expect(output).toEqual(new GetMyUserOutput(authUser.id, authUser.email));

    expect(fakeAuthGateway.getUser).toHaveBeenCalledTimes(1);
    expect(fakeAuthGateway.getUser.mock.calls[0][0]).toBe(loggedUser);
  });
});
