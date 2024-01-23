import 'reflect-metadata';
import { bot } from './bot/bot';
import { AppDataSource } from './db/data-source';
import { logger } from './utils/logger/logger';

const app = async (): Promise<void> => {
  await AppDataSource.initialize();
  logger.info('App started!!!');
  await bot.start();
};

app();
