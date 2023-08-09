const getCognitoRegion = (): string => {
  return process.env.COGNITO_REGION!;
};

const getCognitoUserPoolId = (): string => {
  return process.env.COGNITO_USER_POOL_ID!;
};

const getCognitoUserClientId = (): string => {
  return process.env.COGNITO_USER_CLIENT_ID!;
};

export { getCognitoRegion, getCognitoUserClientId, getCognitoUserPoolId };
