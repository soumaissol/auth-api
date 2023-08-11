import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { buildLocaleFromEvent, sendHttpOkResponse, sendHtttpError } from 'sms-api-commons';

import CoginitoAuthGateway from '../../../infra/auth-gateway/cognito-auth-gateway';
import CustomLocaleProvider from '../../../locale/custom-locale-provider';
import { getCognitoRegion, getCognitoUserClientId, getCognitoUserPoolId } from '../../config/environment';
import LogoutUser from '../../usecase/logout-user';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const locale = buildLocaleFromEvent(new CustomLocaleProvider(), event);

  try {
    const authGateway = new CoginitoAuthGateway(getCognitoRegion(), getCognitoUserPoolId(), getCognitoUserClientId());

    return sendHttpOkResponse(await new LogoutUser(authGateway).execute(event.body));
  } catch (err: any) {
    return sendHtttpError(locale, err);
  }
};
