enum Stage {
  Staging = 'staging',
  Production = 'production',
}

const getStage = (): Stage => {
  return process.env.STAGE as Stage;
};

const isProduction = (): boolean => {
  return getStage() === Stage.Production;
};

const getCognitoRegion = (): string => {
  return process.env.COGNITO_REGION!;
};

const getCognitoUserPoolId = (): string => {
  return process.env.COGNITO_USER_POOL_ID!;
};

export { getCognitoRegion, getCognitoUserPoolId, getStage, isProduction, Stage };
