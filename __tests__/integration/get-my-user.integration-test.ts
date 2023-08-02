import axios from 'axios';
import HttpStatus from 'http-status-codes';

import constants from './constants';

describe('IntegrationTest GetMyUser', () => {
  it(
    'should return simulation when all input is valid',
    async () => {
      const output = await axios.get(`${constants.API_URL}/user`);
      expect(output.status).toBe(HttpStatus.OK);
      expect(output.data).toBe('');
    },
    constants.DEFAULT_TIMEOUT,
  );
});
