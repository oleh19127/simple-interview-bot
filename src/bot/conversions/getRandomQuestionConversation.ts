import { optionService } from '../../services/OptionService';
import { themeService } from '../../services/ThemeService';
import { userService } from '../../services/UserService';
import { getRandom } from '../../utils/getRandom/getRandom';
import type { MyContext, MyConversation } from '../bot';
import { generateOptionKeyboard } from '../keyboards/generateOptionKeyboard';
import { generateThemeKeyboard } from '../keyboards/generateThemeKeyboard';

export async function getRandomQuestionConversation(
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
  const result = await generateThemeKeyboard(allThemes);
  if (typeof result === 'string') {
    return await ctx.reply(result);
  }
  await ctx.reply('What theme do you want to repeat?', {
    reply_markup: result.toFlowed(3).oneTime(true),
  });
  const theme = (await conversation.waitFor('message:text')).message.text;
  const randomQuestion = await conversation.external(() => {
    return getRandom.question(theme);
  });
  if (typeof randomQuestion === 'string') {
    return await ctx.reply(randomQuestion);
  }
  const allQuestionOptions = await conversation.external(() => {
    return optionService.getQuestionOptions(randomQuestion.questionText);
  });
  if (typeof allQuestionOptions === 'string') {
    return await ctx.reply(allQuestionOptions);
  }
  const allOptionKeyboard = await generateOptionKeyboard(allQuestionOptions);
  if (typeof allOptionKeyboard === 'string') {
    return await ctx.reply(allOptionKeyboard);
  }
  await ctx.reply(randomQuestion.questionText, {
    reply_markup: allOptionKeyboard.toFlowed(1).oneTime(true),
  });
  const answer = (await conversation.waitFor('message:text')).message.text;
  const rightAnswer = allQuestionOptions.find((option) => {
    return option.isCorrect;
  });
  if (answer === rightAnswer?.optionText) {
    return await ctx.reply('Right answer 👍');
  }
  await ctx.reply('Wrong answer 👎');
  return await ctx.reply(`Right answer: ${rightAnswer?.optionText}`);
}
