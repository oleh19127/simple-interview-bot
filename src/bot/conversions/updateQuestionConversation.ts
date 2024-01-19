import { themeService } from '../../services/ThemeService';
import { generateThemeKeyboard } from '../keyboards/generateThemeKeyboard';
import { questionService } from '../../services/QuestionService';
import { generateQuestionKeyboard } from '../keyboards/generateQuestionKeyboard';
import { MyContext, MyConversation } from '../bot';

export async function updateQuestionConversation(
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
  await ctx.reply('For which theme do you want to update a question?', {
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
  await ctx.reply('Which question do you want to update?', {
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
  return await ctx.reply(questionUpdateResult);
}
