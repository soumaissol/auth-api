import { faker } from '@faker-js/faker';
import axios from 'axios';
import HttpStatus from 'http-status-codes';

import constants from './constants';

describe('IntegrationTest LoginUser', () => {
  it(
    'should return error when email is valid',
    async () => {
      try {
        await axios.post(`${constants.API_URL}/login`, {
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
    'should return first session when email and password is valid',
    async () => {
      const email = faker.internet.email();
      let response = await axios.post(`${constants.API_URL}/user`, {
        email,
      });
      expect(response.status).toBe(HttpStatus.OK);

      response = await axios.post(`${constants.API_URL}/login`, {
        email,
        password: constants.FAKE_PASSWORD,
      });
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.data.token).toBeNull();
      expect(response.data.refreshToken).toBeNull();
      expect(response.data.expiresIn).toBeNull();
      expect(response.data.challenge).toBeDefined();
      expect(response.data.session).toBeDefined();
    },
    2 * constants.DEFAULT_TIMEOUT,
  );

  it(
    'should return first session when email and password are incorrect',
    async () => {
      const email = faker.internet.email();
      let response = await axios.post(`${constants.API_URL}/user`, {
        email,
      });
      expect(response.status).toBe(HttpStatus.OK);

      try {
        response = await axios.post(
          `${constants.API_URL}/login`,
          {
            email,
            password: 'wrongPassword',
          },
          {
            headers: {
              'Accept-Language': constants.PTBR_ACCEPTED_LANGUAGE,
            },
          },
        );
      } catch (err) {
        expect(err).toHaveProperty('response');
        const response = (err as any).response;
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        expect(response.data.code).toBe('incorrect_email_or_password');
        expect(response.data.message).toBe('e-mail ou senha incorreto');
      }
    },
    2 * constants.DEFAULT_TIMEOUT,
  );
});
