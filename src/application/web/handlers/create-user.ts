import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { sendHttpOkResponse, sendHtttpError } from './common-handlers';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // const solarEnergyGateway = new SolarEnergyGatewayFactory(getStage()).getSolarEnergyGateway();

    return sendHttpOkResponse({ created: true, body: event.body });
  } catch (err: any) {
    return sendHtttpError(err);
  }
};
