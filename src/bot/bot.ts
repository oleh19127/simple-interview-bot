import 'dotenv/config';

import {
  Bot,
  Context,
  GrammyError,
  HttpError,
  Keyboard,
  session,
} from 'grammy';

import {
  type Conversation,
  type ConversationFlavor,
  conversations,
  createConversation,
} from '@grammyjs/conversations';

import { logger } from '../utils/logger/logger';
import { themeService } from '../services/ThemeService';

type MyContext = Context & ConversationFlavor;
type MyConversation = Conversation<MyContext>;

export const bot = new Bot<MyContext>(process.env.BOT_TOKEN as string);

bot.api.setMyCommands([
  {
    command: 'start',
    description: 'Start the bot',
  },
  {
    command: 'add_theme',
    description: 'Add the theme, you want to repeat',
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

bot.use(createConversation(addThemeConversation));

bot.command('start', async (ctx) => {
  const allThemes = await themeService.getAllThemes();
  if (allThemes.length === 0) {
    return await ctx.reply('No themes to display');
  }
  const startKeyboard = new Keyboard().resized();
  for (const theme of allThemes) {
    startKeyboard.add(theme.themeName);
  }
  await ctx.reply(
    `Hello ${ctx.from?.first_name},\n What theme do you want to repeat?`,
    {
      reply_markup: startKeyboard.toFlowed(3),
    },
  );
});

bot.command('add_theme', async (ctx) => {
  await ctx.conversation.enter('addThemeConversation');
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
