import 'dotenv/config';
import { Bot, GrammyError, HttpError } from 'grammy';
import { logger } from '../utils/logger/logger';

export const bot = new Bot(process.env.BOT_TOKEN as string);

bot.command('start', async (ctx) => {
  await ctx.reply(`Hello ${ctx.from?.first_name}`);
});

bot.catch((err) => {
  const ctx = err.ctx;
  logger.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    logger.error('Error in request:', e.description);
  } else if (e instanceof HttpError) {
    logger.error('Could not contact Telegram:', e);
  } else {
    logger.error('Unknown error:', e);
  }
});
