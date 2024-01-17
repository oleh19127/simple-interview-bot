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
import { generateThemeKeyboard } from './keyboard/generateThemeKeyboard';
import { questionService } from '../services/QuestionService';
import { optionService } from '../services/OptionService';
import { generateQuestionKeyboard } from './keyboard/generateQuestionKeyboard';

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
  {
    command: 'update_theme',
    description: 'Update the theme',
  },
  {
    command: 'add_question',
    description: 'Add question and options to theme',
  },
  {
    command: 'update_question',
    description: 'Update question',
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
  const result = await conversation.external(() => {
    return themeService.createTheme(message?.text as string);
  });
  await ctx.reply(result);
}

async function deleteThemeConversion(
  conversation: MyConversation,
  ctx: MyContext,
) {
  const allThemes = await conversation.external(() => {
    return themeService.getAllThemes();
  });
  const result = await generateThemeKeyboard(allThemes);
  if (typeof result === 'string') {
    return await ctx.reply(result);
  }
  await ctx.reply(`What theme do you want to delete?`, {
    reply_markup: result.toFlowed(3).oneTime(true),
  });
  const { message } = await conversation.wait();
  const deletedResult = await conversation.external(() => {
    return themeService.deleteTheme(message?.text as string);
  });
  await ctx.reply(deletedResult);
}

async function updateThemeConversion(
  conversation: MyConversation,
  ctx: MyContext,
) {
  const allThemes = await conversation.external(() => {
    return themeService.getAllThemes();
  });
  const result = await generateThemeKeyboard(allThemes);
  if (typeof result === 'string') {
    return await ctx.reply(result);
  }
  await ctx.reply(`What theme do you want to update?`, {
    reply_markup: result.toFlowed(3).oneTime(true),
  });
  const existTheme = (await conversation.waitFor('message:text')).message.text;
  await ctx.reply('Write new theme name');
  const newThemeName = (await conversation.waitFor('message:text')).message
    .text;
  const updateResult = await conversation.external(() => {
    return themeService.updateTheme(existTheme, newThemeName);
  });
  await ctx.reply(updateResult);
}

async function addQuestionConversation(
  conversation: MyConversation,
  ctx: MyContext,
) {
  const allThemes = await conversation.external(() => {
    return themeService.getAllThemes();
  });
  const result = await generateThemeKeyboard(allThemes);
  if (typeof result === 'string') {
    return await ctx.reply(result);
  }
  await ctx.reply(`For which theme do you want to add a question?`, {
    reply_markup: result.toFlowed(3).oneTime(true),
  });
  const theme = (await conversation.waitFor('message:text')).message.text;
  await ctx.reply('Write new question');
  const newQuestionFromUser = (await conversation.waitFor('message:text'))
    .message.text;
  const responseNewQuestion = await conversation.external(() => {
    return questionService.addQuestion(theme, newQuestionFromUser);
  });
  if (typeof responseNewQuestion === 'string') {
    return await ctx.reply(responseNewQuestion);
  }
  await ctx.reply('How many options you want to add?');
  const optionsFromUser = await conversation.form.number();
  for (let index = 1; index <= optionsFromUser; index++) {
    await ctx.reply(`${index}) option:`);
    const option = (await conversation.waitFor('message:text')).message.text;
    await ctx.reply('This option is correct?\nYes/No');
    let isCorrect: string | boolean = (
      await conversation.waitFor('message:text')
    ).message.text;
    if (isCorrect.toLowerCase() === 'yes') {
      isCorrect = true;
    } else if (isCorrect.toLowerCase() === 'no') {
      isCorrect = false;
    } else {
      return await ctx.reply('Your answer is not correct');
    }
    const responseResultMessage = await conversation.external(
      (): Promise<string> => {
        return optionService.addOption(
          option,
          isCorrect as boolean,
          responseNewQuestion.questionId,
        );
      },
    );
    await ctx.reply(responseResultMessage);
  }
}

async function startConversation(conversation: MyConversation, ctx: MyContext) {
  const allThemes = await conversation.external(() => {
    return themeService.getAllThemes();
  });
  const result = await generateThemeKeyboard(allThemes);
  if (typeof result === 'string') {
    return await ctx.reply(`Hello ${ctx.from?.first_name}\n${result}`);
  }
  return await ctx.reply(
    `Hello ${ctx.from?.first_name},\nWhat theme do you want to repeat?`,
    {
      reply_markup: result.toFlowed(3).oneTime(true),
    },
  );
}

async function updateQuestionConversation(
  conversation: MyConversation,
  ctx: MyContext,
) {
  const allThemes = await conversation.external(() => {
    return themeService.getAllThemes();
  });
  const allThemesKeyboard = await generateThemeKeyboard(allThemes);
  if (typeof allThemesKeyboard === 'string') {
    return await ctx.reply(allThemesKeyboard);
  }
  await ctx.reply(`For which theme do you want to update a question?`, {
    reply_markup: allThemesKeyboard.toFlowed(3).oneTime(true),
  });
  const theme = (await conversation.waitFor('message:text')).message.text;
  const allThemeQuestions = await conversation.external(() => {
    return questionService.getAllThemeQuestions(theme);
  });
  const allQuestionKeyboard = await generateQuestionKeyboard(allThemeQuestions);
  if (typeof allQuestionKeyboard === 'string') {
    return await ctx.reply(allQuestionKeyboard);
  }
  await ctx.reply(`Which question do you want to update?`, {
    reply_markup: allQuestionKeyboard.toFlowed(1).oneTime(true),
  });
  const questionToUpdate = (await conversation.waitFor('message:text')).message
    .text;
  await ctx.reply('Write new question');
  const newQuestionToUpdate = (await conversation.waitFor('message:text'))
    .message.text;

  const questionUpdateResult = await conversation.external(() => {
    return questionService.updateQuestion(
      questionToUpdate,
      newQuestionToUpdate,
    );
  });
  await ctx.reply(questionUpdateResult);
}

bot.use(createConversation(addThemeConversation));
bot.use(createConversation(deleteThemeConversion));
bot.use(createConversation(updateThemeConversion));
bot.use(createConversation(addQuestionConversation));
bot.use(createConversation(startConversation));
bot.use(createConversation(updateQuestionConversation));

bot.command('start', async (ctx) => {
  await ctx.conversation.enter('startConversation');
});

bot.command('add_theme', async (ctx) => {
  await ctx.conversation.enter('addThemeConversation');
});

bot.command('delete_theme', async (ctx) => {
  await ctx.conversation.enter('deleteThemeConversion');
});

bot.command('update_theme', async (ctx) => {
  await ctx.conversation.enter('updateThemeConversion');
});

bot.command('add_question', async (ctx) => {
  await ctx.conversation.enter('addQuestionConversation');
});

bot.command('update_question', async (ctx) => {
  await ctx.conversation.enter('updateQuestionConversation');
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
