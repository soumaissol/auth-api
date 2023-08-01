import winston from 'winston';

import { isProduction } from '../config/environment';

let logger: winston.Logger;

const Logger = {
  get(): winston.Logger {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!logger) {
      logger = winston.createLogger({
        level: 'info',
        format: winston.format.json(),
      });

      if (!isProduction()) {
        logger.add(
          new winston.transports.Console({
            format: winston.format.simple(),
          }),
        );
      }
    }

    return logger;
  },
};

export default Logger;
