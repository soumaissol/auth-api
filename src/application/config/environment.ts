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

export { getStage, isProduction, Stage };
