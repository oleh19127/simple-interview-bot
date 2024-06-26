import { questionService } from '../../services/QuestionService';
import { themeService } from '../../services/ThemeService';
import { userService } from '../../services/UserService';
import type { MyContext, MyConversation } from '../bot';
import { generateQuestionKeyboard } from '../keyboards/generateQuestionKeyboard';
import { generateThemeKeyboard } from '../keyboards/generateThemeKeyboard';

export async function deleteQuestionConversation(
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
  await ctx.reply('For which theme do you want to delete a question?', {
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
  await ctx.reply('Which question do you want to delete?', {
    reply_markup: allQuestionKeyboard.toFlowed(1).oneTime(true),
  });
  const questionToDelete = (await conversation.waitFor('message:text')).message
    .text;
  const questionDeleteResult = await conversation.external(() => {
    return questionService.deleteQuestion(questionToDelete);
  });
  return await ctx.reply(questionDeleteResult);
}
