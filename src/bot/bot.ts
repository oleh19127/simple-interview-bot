import 'dotenv/config';

import { Bot, Context, GrammyError, HttpError, session } from 'grammy';

import {
  type Conversation,
  type ConversationFlavor,
  conversations,
  createConversation,
} from '@grammyjs/conversations';

import { logger } from '../utils/logger/logger';
import { themeService } from '../services/ThemeService';
import { showAllThemeKeyboard } from './keyboard/showAllThemeKeyboard';

type MyContext = Context & ConversationFlavor;
type MyConversation = Conversation<MyContext>;

export const bot = new Bot<MyContext>(process.env.BOT_TOKEN as string);

bot.api.setMyCommands([
  {
    command: 'start',
    description: 'Start the bot and show themes to repeat',
  },
  {
    command: 'add_theme',
    description: 'Add the theme',
  },
  {
    command: 'delete_theme',
    description: 'Delete the theme',
  },
]);

bot.use(session({ initial: () => ({}) }));
bot.use(conversations());

async function addThemeConversation(
  conversation: MyConversation,
  ctx: MyContext,
) {
  await ctx.reply('What theme do you want to add?');
  const { message } = await conversation.wait();
  const result = await themeService.createTheme(message?.text as string);
  await ctx.reply(result);
}

async function deleteThemeConversion(
  conversation: MyConversation,
  ctx: MyContext,
) {
  const result = await showAllThemeKeyboard();
  if (typeof result === 'string') {
    return await ctx.reply(result);
  }
  await ctx.reply(`What theme do you want to delete?`, {
    reply_markup: result.toFlowed(3).oneTime(true),
  });
  const { message } = await conversation.wait();
  const deletedResult = await themeService.deleteTheme(message?.text as string);
  await ctx.reply(deletedResult);
}

bot.use(createConversation(addThemeConversation));
bot.use(createConversation(deleteThemeConversion));

bot.command('start', async (ctx) => {
  const result = await showAllThemeKeyboard();
  if (typeof result === 'string') {
    return await ctx.reply(result);
  }
  await ctx.reply(
    `Hello ${ctx.from?.first_name},\nWhat theme do you want to repeat?`,
    {
      reply_markup: result.toFlowed(3).oneTime(true),
    },
  );
});

bot.command('add_theme', async (ctx) => {
  await ctx.conversation.enter('addThemeConversation');
});

bot.command('delete_theme', async (ctx) => {
  await ctx.conversation.enter('deleteThemeConversion');
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
