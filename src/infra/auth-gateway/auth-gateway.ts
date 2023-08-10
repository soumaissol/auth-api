import type { UserSession } from 'sms-api-commons';

import type AuthSession from '../../domain/entity/auth-session';
import type AuthUser from '../../domain/entity/auth-user';

export default interface AuthGateway {
  getUser(loggedUser: UserSession): Promise<AuthUser>;
  createUser(email: string): Promise<void>;
  loginUser(email: string, password: string): Promise<AuthSession>;
  respondToAuthChallenge(email: string, newPassword: string, session: string): Promise<AuthSession>;
}
