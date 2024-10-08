import { faker } from '@faker-js/faker';
import axios from 'axios';
import HttpStatus from 'http-status-codes';

import constants from './constants';

const email = faker.internet.email();
describe('IntegrationTest ResetUserPassword', () => {
  beforeAll(async () => {
    await axios.post(`${constants.API_URL}/user`, {
      email,
    });
  }, constants.DEFAULT_TIMEOUT);

  it(
    'should return error when email is valid',
    async () => {
      try {
        await axios.post(`${constants.API_URL}/user/password/reset`, {
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
    'should return error when user is not found',
    async () => {
      try {
        await axios.post(
          `${constants.API_URL}/user/password/reset`,
          {
            email: faker.internet.email(),
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
        expect(response.data.code).toBe('no_user_to_reset_password');
        expect(response.data.message).toBe(
          'usuário não encontrado para resetar senha, por favor, crie um usuário com esse email',
        );
      }
    },
    constants.DEFAULT_TIMEOUT,
  );

  it(
    'should return error when user has no password',
    async () => {
      const newUserEmail = faker.internet.email();

      let response = await axios.post(`${constants.API_URL}/user`, {
        email: newUserEmail,
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

      try {
        await axios.post(
          `${constants.API_URL}/user/password/reset`,
          {
            email,
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
        expect(response.data.code).toBe('must_create_password_first');
        expect(response.data.message).toBe(
          'usuário sem senha, por favor, crie um usuário com este e-mail novamente para receber uma senha temporária',
        );
      }
    },
    3 * constants.DEFAULT_TIMEOUT,
  );

  it(
    'should return OK when user email is verified',
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

      response = await axios.post(
        `${constants.API_URL}/user/password/reset`,
        {
          email,
        },
        {
          headers: {
            'Accept-Language': constants.PTBR_ACCEPTED_LANGUAGE,
          },
        },
      );
      expect(response.status).toBe(HttpStatus.OK);
    },
    3 * constants.DEFAULT_TIMEOUT,
  );
});
