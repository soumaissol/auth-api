import type { APIGatewayProxyEvent } from 'aws-lambda';

import LoggedUser from '../../../domain/entity/logged-user';

const buildLoggedUserFromEvent = (event: APIGatewayProxyEvent): LoggedUser | null => {
  if (event.headers.Authorization) {
    return new LoggedUser(event.headers.Authorization);
  }
  return null;
};

export { buildLoggedUserFromEvent };
