import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { buildLocaleFromEvent, getUserSessionFromEvent, sendHttpOkResponse, sendHtttpError } from 'sms-api-commons';

import CoginitoAuthGateway from '../../../infra/auth-gateway/cognito-auth-gateway';
import CustomLocaleProvider from '../../../locale/custom-locale-provider';
import { getCognitoRegion, getCognitoUserClientId, getCognitoUserPoolId } from '../../config/environment';
import GetMyUser from '../../usecase/get-my-user';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const locale = buildLocaleFromEvent(new CustomLocaleProvider(), event);

  try {
    const authGateway = new CoginitoAuthGateway(getCognitoRegion(), getCognitoUserPoolId(), getCognitoUserClientId());
    return sendHttpOkResponse(await new GetMyUser(authGateway).execute(getUserSessionFromEvent(event)));
  } catch (err: any) {
    return sendHtttpError(locale, err);
  }
};
