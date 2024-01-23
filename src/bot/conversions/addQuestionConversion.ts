import { optionService } from '../../services/OptionService';
import { questionService } from '../../services/QuestionService';
import { themeService } from '../../services/ThemeService';
import { userService } from '../../services/UserService';
import { MyContext, MyConversation } from '../bot';
import { generateThemeKeyboard } from '../keyboards/generateThemeKeyboard';

export async function addQuestionConversation(
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
  await ctx.reply('For which theme do you want to add a question?', {
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
    await ctx.reply('This option is correct?\ny/n');
    let isCorrect: string | boolean = (
      await conversation.waitFor('message:text')
    ).message.text;
    if (isCorrect.toLowerCase() === 'y') {
      isCorrect = true;
    } else if (isCorrect.toLowerCase() === 'n') {
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
