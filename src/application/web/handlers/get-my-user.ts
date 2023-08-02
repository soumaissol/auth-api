import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import CoginitoAuthGateway from '../../../infra/auth-gateway/cognito-auth-gateway';
import { getRegion } from '../../config/environment';
import GetMyUser from '../../usecase/get-my-user';
import { buildLoggedUserFromEvent } from '../session/session-info';
import { sendHttpOkResponse, sendHtttpError } from './common-handlers';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const authGateway = new CoginitoAuthGateway(getRegion());
    return sendHttpOkResponse(await new GetMyUser(authGateway).execute(buildLoggedUserFromEvent(event)));
  } catch (err: any) {
    return sendHtttpError(err);
  }
};
