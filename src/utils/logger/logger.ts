import { pino } from 'pino';

const loggerOptions = {
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
};
export const logger = pino(loggerOptions);
