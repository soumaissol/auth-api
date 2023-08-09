import { faker } from '@faker-js/faker';
import axios from 'axios';
import HttpStatus from 'http-status-codes';

import constants from './constants';

describe('IntegrationTest CreateUser', () => {
  it(
    'should return error when email is valid',
    async () => {
      try {
        await axios.post(`${constants.API_URL}/user`, {
          email: 'teste',
        });
        expect(true).toBe(false);
      } catch (err) {
        expect(err).toHaveProperty('response');
        const response = (err as any).response;
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        expect(response.data.code).toBe('invalid_email');
        expect(response.data.message).toBe('invalid email');
      }
    },
    constants.DEFAULT_TIMEOUT,
  );

  it(
    'should return error when email is valid',
    async () => {
      const response = await axios.post(`${constants.API_URL}/user`, {
        email: faker.internet.email(),
      });
      expect(response.status).toBe(HttpStatus.OK);
    },
    constants.DEFAULT_TIMEOUT,
  );
});
