import type { AWSError } from 'aws-sdk';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import type {
  AdminInitiateAuthResponse,
  AdminRespondToAuthChallengeResponse,
} from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { isProduction, Logger } from 'sms-api-commons';

import AuthSession from '../../domain/entity/auth-session';
import ExpiredRefreshToken from '../../domain/errors/expired-refresh-token';
import IncorrectEmailOrPassword from '../../domain/errors/incorrect-email-or-password';
import type AuthGateway from './auth-gateway';

export default class CoginitoAuthGateway implements AuthGateway {
  constructor(
    readonly region: string,
    readonly userPoolId: string,
    readonly userClientId: string,
  ) {}
  createUser(email: string): Promise<void> {
    const logger = Logger.get();
    const cognito = new CognitoIdentityServiceProvider({ region: this.region });
    return new Promise((resolve, reject) => {
      cognito.adminCreateUser(
        {
          UserPoolId: this.userPoolId,
          Username: email,
          DesiredDeliveryMediums: ['EMAIL'],
          TemporaryPassword: isProduction() ? undefined : 'SouMaisSol@1234', // for integration tests
          UserAttributes: [
            {
              Name: 'email',
              Value: email,
            },
            {
              Name: 'custom:role',
              Value: 'user',
            },
          ],
        },
        (err: AWSError | undefined) => {
          if (err) {
            logger.error(`error creating user ${err}`);

            reject(err);
            return;
          }
          resolve();
        },
      );
    });
  }

  loginUser(email: string, password: string): Promise<AuthSession> {
    const logger = Logger.get();
    const cognito = new CognitoIdentityServiceProvider({ region: this.region });
    return new Promise((resolve, reject) => {
      cognito.adminInitiateAuth(
        {
          AuthFlow: 'ADMIN_NO_SRP_AUTH',
          ClientId: this.userClientId,
          UserPoolId: this.userPoolId,
          AuthParameters: {
            USERNAME: email,
            PASSWORD: password,
          },
        },
        (err: AWSError | undefined, data: AdminInitiateAuthResponse) => {
          if (err) {
            if (err.code === 'NotAuthorizedException') {
              reject(new IncorrectEmailOrPassword());
              return;
            }
            logger.error(`error login user ${err}`);

            reject(err);
            return;
          }
          resolve(
            new AuthSession(
              data.AuthenticationResult?.IdToken || null,
              data.AuthenticationResult?.RefreshToken || null,
              data.AuthenticationResult?.ExpiresIn || null,
              data.ChallengeName || null,
              data.Session || null,
            ),
          );
        },
      );
    });
  }

  respondToAuthChallenge(email: string, newPassword: string, session: string): Promise<AuthSession> {
    const logger = Logger.get();
    const cognito = new CognitoIdentityServiceProvider({ region: this.region });
    return new Promise((resolve, reject) => {
      cognito.adminRespondToAuthChallenge(
        {
          ChallengeName: 'NEW_PASSWORD_REQUIRED',
          ClientId: this.userClientId,
          UserPoolId: this.userPoolId,
          ChallengeResponses: {
            USERNAME: email,
            NEW_PASSWORD: newPassword,
          },
          Session: session,
        },
        (err: AWSError | undefined, data: AdminRespondToAuthChallengeResponse) => {
          if (err) {
            logger.error(`error responding to challenge ${err}`);

            reject(err);
            return;
          }
          resolve(
            new AuthSession(
              data.AuthenticationResult?.IdToken || null,
              data.AuthenticationResult?.RefreshToken || null,
              data.AuthenticationResult?.ExpiresIn || null,
              data.ChallengeName || null,
              data.Session || null,
            ),
          );
        },
      );
    });
  }

  refreshSession(refreshToken: string): Promise<AuthSession> {
    const logger = Logger.get();
    const cognito = new CognitoIdentityServiceProvider({ region: this.region });
    return new Promise((resolve, reject) => {
      cognito.adminInitiateAuth(
        {
          AuthFlow: 'REFRESH_TOKEN_AUTH',
          ClientId: this.userClientId,
          UserPoolId: this.userPoolId,
          AuthParameters: {
            REFRESH_TOKEN: refreshToken,
          },
        },
        (err: AWSError | undefined, data: AdminInitiateAuthResponse) => {
          if (err) {
            if (err.code === 'NotAuthorizedException') {
              reject(new ExpiredRefreshToken());
              return;
            }

            logger.error(`error refresh token ${err}`);
            reject(err);
            return;
          }
          resolve(
            new AuthSession(
              data.AuthenticationResult?.IdToken || null,
              data.AuthenticationResult?.RefreshToken || null,
              data.AuthenticationResult?.ExpiresIn || null,
              data.ChallengeName || null,
              data.Session || null,
            ),
          );
        },
      );
    });
  }

  logout(username: string): Promise<void> {
    const logger = Logger.get();
    const cognito = new CognitoIdentityServiceProvider({ region: this.region });
    return new Promise((resolve, reject) => {
      cognito.adminUserGlobalSignOut(
        {
          Username: username,
          UserPoolId: this.userPoolId,
        },
        (err: AWSError | undefined) => {
          if (err) {
            logger.error(`error login user ${err}`);

            reject(err);
            return;
          }
          resolve();
        },
      );
    });
  }
}
