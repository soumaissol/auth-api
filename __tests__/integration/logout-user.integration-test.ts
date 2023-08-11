import { faker } from '@faker-js/faker';
import axios from 'axios';
import HttpStatus from 'http-status-codes';

import constants from './constants';

const email = faker.internet.email();
describe('IntegrationTest LogoutUser', () => {
  beforeAll(async () => {
    await axios.post(`${constants.API_URL}/user`, {
      email,
    });
  }, constants.DEFAULT_TIMEOUT);

  it(
    'should return error when id is valid',
    async () => {
      try {
        await axios.post(`${constants.API_URL}/logout`, {
          teste: 'teste',
        });
        expect(true).toBe(false);
      } catch (err) {
        expect(err).toHaveProperty('response');
        const response = (err as any).response;
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        expect(response.data.code).toBe('invalid_id');
        expect(response.data.message).toBe('invalid id');
      }
    },
    constants.DEFAULT_TIMEOUT,
  );

  it(
    'should return logout user when id is valid',
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

      response = await axios.get(`${constants.API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${response.data.token}`,
        },
      });
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.data.id).toBeDefined();

      response = await axios.post(`${constants.API_URL}/logout`, {
        id: response.data.id,
      });
      expect(response.status).toBe(HttpStatus.OK);
    },
    4 * constants.DEFAULT_TIMEOUT,
  );
});
