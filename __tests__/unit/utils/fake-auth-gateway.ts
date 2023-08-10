import type AuthGateway from '../../../src/infra/auth-gateway/auth-gateway';

const buildFakeAuthGateway = (): AuthGateway => {
  return {
    createUser: jest.fn(),
    loginUser: jest.fn(),
    respondToAuthChallenge: jest.fn(),
  };
};

export { buildFakeAuthGateway };
