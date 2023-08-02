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

const getRegion = (): string => {
  return process.env.REGION!;
};

export { getRegion, getStage, isProduction, Stage };
