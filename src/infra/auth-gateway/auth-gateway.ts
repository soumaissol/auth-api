import type AuthSession from '../../domain/entity/auth-session';

export default interface AuthGateway {
  createUser(email: string): Promise<void>;
  loginUser(email: string, password: string): Promise<AuthSession>;
  respondToAuthChallenge(email: string, newPassword: string, session: string): Promise<AuthSession>;
  refreshSession(refreshToken: string): Promise<AuthSession>;
  logout(username: string): Promise<void>;
}
