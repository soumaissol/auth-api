import { faker } from '@faker-js/faker';
import axios from 'axios';
import HttpStatus from 'http-status-codes';

import constants from './constants';
const email = faker.internet.email();

describe('IntegrationTest GetMyUser', () => {
  beforeAll(async () => {
    await axios.post(`${constants.API_URL}/user`, {
      email,
    });
  }, constants.DEFAULT_TIMEOUT);
  it(
    'should return error when auth token is invalid',
    async () => {
      try {
        await axios.get(`${constants.API_URL}/user`, {
          headers: {
            Authorization: 'Bearer fake.token',
          },
        });
        expect(true).toBe(false);
      } catch (err) {
        expect(err).toHaveProperty('response');
        const response = (err as any).response;
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
        expect(response.data.message).toBeDefined();
      }
    },
    constants.DEFAULT_TIMEOUT,
  );
  it(
    'should return first session when email and password is valid',
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
      expect(response.data.email).toBe(email);
      expect(response.data.roles).toEqual(['user']);
    },
    3 * constants.DEFAULT_TIMEOUT,
  );
});
