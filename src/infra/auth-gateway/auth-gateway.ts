import type UserSession from 'sms-api-commons/dist/entity/user-session';

import type AuthUser from '../../domain/entity/auth-user';

export default interface AuthGateway {
  getUser(loggedUser: UserSession): Promise<AuthUser>;
  createUser(email: string): Promise<void>;
}
