import type { AWSError } from 'aws-sdk';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import type {
  AdminInitiateAuthResponse,
  AdminRespondToAuthChallengeResponse,
} from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { isProduction, Logger } from 'sms-api-commons';

import AuthSession from '../../domain/entity/auth-session';
import EmailNotVerifiedToResetPassword from '../../domain/errors/email-not-verified-to-reset-password';
import ExpiredRefreshToken from '../../domain/errors/expired-refresh-token';
import IncorrectEmailOrPassword from '../../domain/errors/incorrect-email-or-password';
import MustCreatePasswordFirst from '../../domain/errors/must-create-password-first';
import NoUserToResetPassword from '../../domain/errors/no-user-to-reset-password';
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
      const params: CognitoIdentityServiceProvider.Types.AdminCreateUserRequest = {
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
          {
            Name: 'email_verified',
            Value: 'true',
          },
        ],
      };
      cognito.adminCreateUser(params, (err: AWSError | undefined) => {
        if (err) {
          if (err.code === 'UsernameExistsException') {
            cognito.adminCreateUser({ ...params, MessageAction: 'RESEND' }, (err: AWSError | undefined) => {
              if (err) {
                logger.error(`error creating user ${err}`);

                reject(err);
                return;
              }
              resolve();
            });
            return;
          }
          logger.error(`error creating user ${err}`);

          reject(err);
          return;
        }
        resolve();
      });
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
            logger.error(`error logout user ${err}`);

            reject(err);
            return;
          }
          resolve();
        },
      );
    });
  }

  resetUserPassword(username: string): Promise<void> {
    const logger = Logger.get();
    const cognito = new CognitoIdentityServiceProvider({ region: this.region });
    return new Promise((resolve, reject) => {
      cognito.adminResetUserPassword(
        {
          Username: username,
          UserPoolId: this.userPoolId,
        },
        (err: AWSError | undefined) => {
          if (err) {
            if (err.code === 'UserNotFoundException') {
              reject(new NoUserToResetPassword());
              return;
            }
            if (err.code === 'InvalidParameterException' && err.message.indexOf('verified') !== -1) {
              reject(new EmailNotVerifiedToResetPassword());
              return;
            }
            if (err.code === 'NotAuthorizedException' && err.message.indexOf('current state') !== -1) {
              reject(new MustCreatePasswordFirst());
              return;
            }

            logger.error(`error resetUserPassword ${err}`);

            reject(err);
            return;
          }
          resolve();
        },
      );
    });
  }

  confirmResetPassword(username: string, confirmationCode: string, password: string): Promise<void> {
    const logger = Logger.get();
    const cognito = new CognitoIdentityServiceProvider({ region: this.region });
    return new Promise((resolve, reject) => {
      cognito.confirmForgotPassword(
        {
          Username: username,
          ConfirmationCode: confirmationCode,
          ClientId: this.userClientId,
          Password: password,
        },
        (err: AWSError | undefined) => {
          if (err) {
            logger.error(`error confirmResetPassword ${err}`);

            reject(err);
            return;
          }
          resolve();
        },
      );
    });
  }
}
