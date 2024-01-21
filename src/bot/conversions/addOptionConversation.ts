import { themeService } from '../../services/ThemeService';
import { generateThemeKeyboard } from '../keyboards/generateThemeKeyboard';
import { questionService } from '../../services/QuestionService';
import { generateQuestionKeyboard } from '../keyboards/generateQuestionKeyboard';
import { optionService } from '../../services/OptionService';
import { MyContext, MyConversation } from '../bot';

export async function addOptionConversation(
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
  await ctx.reply('This option is correct?\nYes/No');
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
