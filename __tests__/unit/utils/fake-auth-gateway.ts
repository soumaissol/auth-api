import type AuthGateway from '../../../src/infra/auth-gateway/auth-gateway';

const buildFakeAuthGateway = (): AuthGateway => {
  return {
    getUser: jest.fn(),
    createUser: jest.fn(),
    loginUser: jest.fn(),
    respondToAuthChallenge: jest.fn(),
  };
};

export { buildFakeAuthGateway };
