import { bot } from './bot/bot';
import { AppDataSource } from './db/data-source';
import { logger } from './utils/logger/logger';
import 'reflect-metadata';

const app = async () => {
  await AppDataSource.initialize();
  logger.info('App started!!!');
  await bot.start();
};

app();
