import { faker } from '@faker-js/faker';
import axios from 'axios';
import HttpStatus from 'http-status-codes';

import constants from './constants';
const email = faker.internet.email();

describe('IntegrationTest RefreshUserSession', () => {
  beforeAll(async () => {
    await axios.post(`${constants.API_URL}/user`, {
      email,
    });
  }, constants.DEFAULT_TIMEOUT);

  it(
    'should return error when refresh token is expired',
    async () => {
      try {
        await axios.post(
          `${constants.API_URL}/session/refresh`,
          {
            refreshToken: 'a',
          },
          {
            headers: {
              'Accept-Language': constants.PTBR_ACCEPTED_LANGUAGE,
            },
          },
        );
        expect(true).toBe(false);
      } catch (err) {
        expect(err).toHaveProperty('response');
        const response = (err as any).response;
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        expect(response.data.code).toBe('expired_refresh_token');
        expect(response.data.message).toBe('token para renovar a sessão expirado, faça login novamente');
      }
    },
    constants.DEFAULT_TIMEOUT,
  );

  it(
    'should return new token when session is refreshed',
    async () => {
      let response = await axios.post(`${constants.API_URL}/login`, {
        email,
        password: constants.FAKE_PASSWORD,
      });
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.data.token).toBeNull();
      expect(response.data.refreshToken).toBeNull();
      expect(response.data.expiresIn).toBeNull();
      expect(response.data.challenge).toBeDefined();
      expect(response.data.session).toBeDefined();

      response = await axios.post(`${constants.API_URL}/user/password`, {
        email,
        password: constants.FAKE_PASSWORD,
        confirmPassword: constants.FAKE_PASSWORD,
        session: response.data.session,
      });
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.data.token).toBeDefined();
      expect(response.data.refreshToken).toBeDefined();
      expect(response.data.expiresIn).toBeDefined();
      expect(response.data.challenge).toBeNull();
      expect(response.data.session).toBeNull();

      response = await axios.post(`${constants.API_URL}/session/refresh`, {
        refreshToken: response.data.refreshToken,
      });
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.data.token).toBeDefined();
      expect(response.data.refreshToken).toBeNull();
      expect(response.data.expiresIn).toBeDefined();
      expect(response.data.challenge).toBeNull();
      expect(response.data.session).toBeNull();
    },
    3 * constants.DEFAULT_TIMEOUT,
  );
});
