import type UserSession from 'sms-api-commons/dist/entity/user-session';

import AuthGateway from '../../infra/auth-gateway/auth-gateway';
import GetMyUserOutput from '../dto/output/get-my-user-output';

export default class GetMyUser {
  constructor(readonly authGateway: AuthGateway) {}

  async execute(userSession: UserSession | null): Promise<GetMyUserOutput | null> {
    if (userSession === null) {
      return null;
    }
    const authUser = await this.authGateway.getUser(userSession);

    return new GetMyUserOutput(authUser.id, authUser.email);
  }
}
