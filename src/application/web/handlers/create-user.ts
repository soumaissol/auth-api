import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import CoginitoAuthGateway from '../../../infra/auth-gateway/cognito-auth-gateway';
import { getCognitoRegion, getCognitoUserPoolId } from '../../config/environment';
import CreateUser from '../../usecase/create-user';
import { sendHttpOkResponse, sendHtttpError } from './common-handlers';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const authGateway = new CoginitoAuthGateway(getCognitoRegion(), getCognitoUserPoolId());

    return sendHttpOkResponse(await new CreateUser(authGateway).execute(event.body));
  } catch (err: any) {
    return sendHtttpError(err);
  }
};
