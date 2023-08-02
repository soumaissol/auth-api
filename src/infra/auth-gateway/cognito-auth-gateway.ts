import type { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

import Logger from '../../application/logger/logger';
import AuthUser from '../../domain/entity/auth-user';
import type LoggedUser from '../../domain/entity/logged-user';
import type AuthGateway from './auth-gateway';

export default class CoginitoAuthGateway implements AuthGateway {
  constructor(readonly region: string) {}
  getUser(loggedUser: LoggedUser): Promise<AuthUser> {
    const logger = Logger.get();

    let decodedToken: null | JwtPayload = null;
    try {
      decodedToken = jwt.decode(loggedUser.authToken, { json: true });
    } catch (err) {
      logger.error(`token invalid ${err}`);
      throw err;
    }

    if (decodedToken === null) {
      logger.error('token decoded is null');
      throw new Error('token decoded is null');
    }

    return Promise.resolve(new AuthUser(decodedToken.sub || '', decodedToken.email));
  }
}
