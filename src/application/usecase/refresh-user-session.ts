import { convertAndValidateInput } from 'sms-api-commons';

import AuthGateway from '../../infra/auth-gateway/auth-gateway';
import RefreshUserSessionInput from '../dto/input/refresh-user-session-input';
import RefreshUserSessionOutput from '../dto/output/refresh-user-session-output';

export default class RefreshUserSession {
  constructor(readonly authGateway: AuthGateway) {}

  async execute(input: any): Promise<RefreshUserSessionOutput> {
    const validInput = convertAndValidateInput<RefreshUserSessionInput>(input, new RefreshUserSessionInput(input));

    const authSession = await this.authGateway.refreshSession(validInput.refreshToken);
    return new RefreshUserSessionOutput(
      authSession.token,
      authSession.refreshToken,
      authSession.expiresIn,
      authSession.challenge,
      authSession.session,
    );
  }
}
