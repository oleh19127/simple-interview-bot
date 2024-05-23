import { questionService } from '../../services/QuestionService';
import { themeService } from '../../services/ThemeService';
import { userService } from '../../services/UserService';
import type { MyContext, MyConversation } from '../bot';
import { generateQuestionKeyboard } from '../keyboards/generateQuestionKeyboard';
import { generateThemeKeyboard } from '../keyboards/generateThemeKeyboard';

export async function updateQuestionConversation(
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
  await ctx.reply('For which theme do you want to update a question?', {
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
  await ctx.reply('Which question do you want to update?', {
    reply_markup: allQuestionKeyboard.toFlowed(1).oneTime(true),
  });
  const questionToUpdate = (await conversation.waitFor('message:text')).message
    .text;
  await ctx.reply('Write new question');
  const newQuestionToUpdate = (await conversation.waitFor('message:text'))
    .message.text;
  if (questionToUpdate === newQuestionToUpdate) {
    return await ctx.reply(
      'The existing question is the same as you renamed it!',
    );
  }
  const questionUpdateResult = await conversation.external(() => {
    return questionService.updateQuestion(
      questionToUpdate,
      newQuestionToUpdate,
    );
  });
  return await ctx.reply(questionUpdateResult);
}
