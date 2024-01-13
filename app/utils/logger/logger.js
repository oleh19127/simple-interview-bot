import { pino } from 'pino';
import 'dotenv/config';

const loggerOptions = {
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
};
export const logger = pino(loggerOptions);
