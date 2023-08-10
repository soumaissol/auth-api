import { UserSession } from 'sms-api-commons';

import GetMyUserOutput from '../../../../src/application/dto/output/get-my-user-output';
import GetMyUser from '../../../../src/application/usecase/get-my-user';
import AuthUser from '../../../../src/domain/entity/auth-user';
import { buildFakeAuthGateway } from '../../utils/fake-auth-gateway';

describe('Test GetMyUser usecase', () => {
  it('should return null when logged user is null', async () => {
    const fakeAuthGateway = buildFakeAuthGateway();

    const getMyUser = new GetMyUser(fakeAuthGateway);

    const output = await getMyUser.execute(null);
    expect(output).toBeNull();
  });

  it('should return auth user when logged user is valid', async () => {
    const userSession = {
      authToken: 'fake.token',
      id: 'my-id',
      email: 'email@email.com',
      roles: ['user'],
    };
    const getMyUser = new GetMyUser(buildFakeAuthGateway());

    const output = await getMyUser.execute(userSession);
    expect(output).toEqual(new GetMyUserOutput(userSession.id, userSession.email, userSession.roles));
  });
});
