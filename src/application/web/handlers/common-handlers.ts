import type { APIGatewayProxyResult } from 'aws-lambda';
import HttpStatus from 'http-status-codes';

import GenericError from '../../../domain/errors/generic-error';
import InvalidInput from '../../errors/invalid-input';
import Logger from '../../logger/logger';

const defaultHeaders = (): any => {
  return {
    'Access-Control-Allow-Headers': 'Content-Type,Accept',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
  };
};

const sendHttpOkResponse = (data: any): APIGatewayProxyResult => {
  return {
    statusCode: HttpStatus.OK,
    body: JSON.stringify(data),
    headers: defaultHeaders(),
  };
};

const sendHtttpError = (err: any): APIGatewayProxyResult => {
  const logger = Logger.get();
  logger.error(`catch error ${JSON.stringify(err)}`);

  let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  let body = JSON.stringify(err?.message || 'Unknow error');

  if (err instanceof InvalidInput) {
    body = JSON.stringify(err);
    statusCode = HttpStatus.BAD_REQUEST;
  } else if (err instanceof GenericError) {
    body = JSON.stringify(err);
    statusCode = HttpStatus.BAD_REQUEST;
  }

  return { statusCode, body, headers: defaultHeaders() };
};

export { sendHttpOkResponse, sendHtttpError };
