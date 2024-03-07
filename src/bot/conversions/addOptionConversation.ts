import { Keyboard } from 'grammy';
import { optionService } from '../../services/OptionService';
import { questionService } from '../../services/QuestionService';
import { themeService } from '../../services/ThemeService';
import { userService } from '../../services/UserService';
import { MyContext, MyConversation } from '../bot';
import { generateQuestionKeyboard } from '../keyboards/generateQuestionKeyboard';
import { generateThemeKeyboard } from '../keyboards/generateThemeKeyboard';

export async function addOptionConversation(
  conversation: MyConversation,
  ctx: MyContext,
) {
  const user = await conversation.external(() => {
    return userService.getOneUser(ctx.from?.username as string);
  });
  if (typeof user === 'string') {
    return await ctx.reply(user);
  }
  const allThemes = await conversation.external(() => {
    return themeService.getAllThemes(user.userId);
  });
  const allThemesKeyboard = await generateThemeKeyboard(allThemes);
  if (typeof allThemesKeyboard === 'string') {
    return await ctx.reply(allThemesKeyboard);
  }
  await ctx.reply('To which theme do you want to add an answer option?', {
    reply_markup: allThemesKeyboard.toFlowed(3).oneTime(true),
  });
  const theme = (await conversation.waitFor('message:text')).message.text;
  const allThemeQuestions = await conversation.external(() => {
    return questionService.getAllThemeQuestions(theme);
  });
  if (typeof allThemeQuestions === 'string') {
    return await ctx.reply(allThemeQuestions);
  }
  const allQuestionKeyboard = await generateQuestionKeyboard(allThemeQuestions);
  if (typeof allQuestionKeyboard === 'string') {
    return await ctx.reply(allQuestionKeyboard);
  }
  await ctx.reply('To which question do you want to add an answer option?', {
    reply_markup: allQuestionKeyboard.toFlowed(1).oneTime(true),
  });
  const questionToAddOption = (await conversation.waitFor('message:text'))
    .message.text;
  const question = await conversation.external(() => {
    return questionService.getOneQuestion(questionToAddOption);
  });
  if (typeof question === 'string') {
    return await ctx.reply(question);
  }
  await ctx.reply('Write a new answer option');
  const newAnswerOption = (await conversation.waitFor('message:text')).message
    .text;
  const yesOrNoKeyboard = new Keyboard()
    .text('YES')
    .text('NO')
    .oneTime(true)
    .resized()
    .toFlowed(2);
  await ctx.reply('This option is correct?', {
    reply_markup: yesOrNoKeyboard,
  });
  let isCorrect: string | boolean = (await conversation.waitFor('message:text'))
    .message.text;
  if (isCorrect.toLowerCase() === 'yes') {
    isCorrect = true;
  } else if (isCorrect.toLowerCase() === 'no') {
    isCorrect = false;
  } else {
    return await ctx.reply('Your answer is not correct');
  }
  const addAnswerOptionResult = await conversation.external(() => {
    return optionService.addOption(
      newAnswerOption,
      isCorrect as boolean,
      question.questionId,
    );
  });
  return await ctx.reply(addAnswerOptionResult);
}
