import type AuthUser from '../../domain/entity/auth-user';
import type LoggedUser from '../../domain/entity/logged-user';

export default interface AuthGateway {
  getUser(loggedUser: LoggedUser): Promise<AuthUser>;
  createUser(email: string): Promise<void>;
}
