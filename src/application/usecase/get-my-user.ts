import type LoggedUser from '../../domain/entity/logged-user';
import AuthGateway from '../../infra/auth-gateway/auth-gateway';
import GetMyUserOutput from '../dto/output/get-my-user-output';

export default class GetMyUser {
  constructor(readonly authGateway: AuthGateway) {}

  async execute(loggedUser: LoggedUser | null): Promise<GetMyUserOutput | null> {
    if (loggedUser === null) {
      return null;
    }
    const authUser = await this.authGateway.getUser(loggedUser);

    return new GetMyUserOutput(authUser.id, authUser.email);
  }
}
