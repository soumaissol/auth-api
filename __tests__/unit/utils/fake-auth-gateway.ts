import type AuthGateway from '../../../src/infra/auth-gateway/auth-gateway';

const buildFakeAuthGateway = (): AuthGateway => {
  return {
    createUser: jest.fn(),
    loginUser: jest.fn(),
    respondToAuthChallenge: jest.fn(),
    refreshSession: jest.fn(),
    logout: jest.fn(),
    resetUserPassword: jest.fn(),
  };
};

export { buildFakeAuthGateway };
