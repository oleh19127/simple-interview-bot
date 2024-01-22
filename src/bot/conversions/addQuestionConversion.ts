import { optionService } from '../../services/OptionService';
import { questionService } from '../../services/QuestionService';
import { themeService } from '../../services/ThemeService';
import { MyContext, MyConversation } from '../bot';
import { generateThemeKeyboard } from '../keyboards/generateThemeKeyboard';

export async function addQuestionConversation(
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
