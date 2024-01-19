import { themeService } from '../../services/ThemeService';
import { generateThemeKeyboard } from '../keyboards/generateThemeKeyboard';
import { questionService } from '../../services/QuestionService';
import { generateQuestionKeyboard } from '../keyboards/generateQuestionKeyboard';
import { optionService } from '../../services/OptionService';
import { generateOptionKeyboard } from '../keyboards/generateOptionKeyboard';
import { MyContext, MyConversation } from '../bot';

export async function updateOptionConversation(
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
  await ctx.reply('To which theme do you want to update an answer option?', {
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
  await ctx.reply('To which question do you want to update an answer option?', {
    reply_markup: allQuestionKeyboard.toFlowed(1).oneTime(true),
  });
  const questionToUpdateOption = (await conversation.waitFor('message:text'))
    .message.text;
  const allQuestionOptions = await conversation.external(() => {
    return optionService.getQuestionOptions(questionToUpdateOption);
  });
  if (typeof allQuestionOptions === 'string') {
    return await ctx.reply(allQuestionOptions);
  }
  const allOptionKeyboard = await generateOptionKeyboard(allQuestionOptions);
  if (typeof allOptionKeyboard === 'string') {
    return await ctx.reply(allOptionKeyboard);
  }
  await ctx.reply('To which option do you want to update?', {
    reply_markup: allOptionKeyboard.toFlowed(1).oneTime(true),
  });
  const exitOption = (await conversation.waitFor('message:text')).message.text;
  await ctx.reply('Write new option');
  const newOption = (await conversation.waitFor('message:text')).message.text;
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
  const updateOptionResult = await conversation.external(() => {
    return optionService.updateOption(
      exitOption,
      newOption,
      isCorrect as boolean,
    );
  });
  return await ctx.reply(updateOptionResult);
}
