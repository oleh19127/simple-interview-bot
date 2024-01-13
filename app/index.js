import { bot } from './bot/bot.js';
import { logger } from './utils/logger/logger.js';

const app = async () => {
  logger.info('App started!!!');
  await bot.start();
};

app();
