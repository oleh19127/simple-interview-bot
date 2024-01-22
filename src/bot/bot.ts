import {
  type Conversation,
  type ConversationFlavor,
  conversations,
  createConversation,
} from '@grammyjs/conversations';
import 'dotenv/config';
import { Bot, Context, GrammyError, HttpError, session } from 'grammy';
import { commandsUtil } from '../utils/commandsUtil/CommandsUtil';
import { logger } from '../utils/logger/logger';
import { commands } from './commands/commands';
import { addOptionConversation } from './conversions/addOptionConversation';
import { addQuestionConversation } from './conversions/addQuestionConversion';
import { addThemeConversation } from './conversions/addThemeConversion';
import { deleteOptionConversation } from './conversions/deleteOptionConversation';
import { deleteQuestionConversation } from './conversions/deleteQuestionConversation';
import { deleteThemeConversion } from './conversions/deleteThemeConversion';
import { getRandomQuestionConversation } from './conversions/getRandomQuestionConversation';
import { updateOptionConversation } from './conversions/updateOptionConversation';
import { updateQuestionConversation } from './conversions/updateQuestionConversation';
import { updateThemeConversion } from './conversions/updateThemeConversion';

export type MyContext = Context & ConversationFlavor;
export type MyConversation = Conversation<MyContext>;

export const bot = new Bot<MyContext>(process.env.BOT_TOKEN as string);

bot.use(session({ initial: () => ({}) }));
bot.use(conversations());

bot.use(createConversation(addThemeConversation));
bot.use(createConversation(deleteThemeConversion));
bot.use(createConversation(updateThemeConversion));
bot.use(createConversation(addQuestionConversation));
bot.use(createConversation(updateQuestionConversation));
bot.use(createConversation(deleteQuestionConversation));
bot.use(createConversation(addOptionConversation));
bot.use(createConversation(updateOptionConversation));
bot.use(createConversation(deleteOptionConversation));
bot.use(createConversation(getRandomQuestionConversation));

bot.command('start', async (ctx) => {
  await ctx.api.setMyCommands(commands);
  await ctx.reply(
    `Hello ${ctx.message?.from.first_name}, where do you want to start?`,
  );
  return await ctx.reply(await commandsUtil.getHelpText(commands));
});

bot.command('get_random_question', async (ctx) => {
  return await ctx.conversation.enter('getRandomQuestionConversation');
});

bot.command('add_theme', async (ctx) => {
  return await ctx.conversation.enter('addThemeConversation');
});

bot.command('delete_theme', async (ctx) => {
  return await ctx.conversation.enter('deleteThemeConversion');
});

bot.command('update_theme', async (ctx) => {
  return await ctx.conversation.enter('updateThemeConversion');
});

bot.command('add_question', async (ctx) => {
  return await ctx.conversation.enter('addQuestionConversation');
});

bot.command('update_question', async (ctx) => {
  return await ctx.conversation.enter('updateQuestionConversation');
});

bot.command('delete_question', async (ctx) => {
  return await ctx.conversation.enter('deleteQuestionConversation');
});

bot.command('add_option', async (ctx) => {
  return await ctx.conversation.enter('addOptionConversation');
});

bot.command('update_option', async (ctx) => {
  return await ctx.conversation.enter('updateOptionConversation');
});

bot.command('delete_option', async (ctx) => {
  return await ctx.conversation.enter('deleteOptionConversation');
});

bot.command('help', async (ctx) => {
  return await ctx.reply(await commandsUtil.getHelpText(commands));
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
