import type { UserSession } from 'sms-api-commons';

import AuthGateway from '../../infra/auth-gateway/auth-gateway';
import GetMyUserOutput from '../dto/output/get-my-user-output';

export default class GetMyUser {
  constructor(readonly authGateway: AuthGateway) {}

  async execute(userSession: UserSession | null): Promise<GetMyUserOutput | null> {
    if (userSession === null) {
      return null;
    }

    return new GetMyUserOutput(userSession.id, userSession.email, userSession.roles);
  }
}
