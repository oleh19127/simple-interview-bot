import { themeService } from '../../services/ThemeService';
import { MyContext, MyConversation } from '../bot';
import { generateThemeKeyboard } from '../keyboards/generateThemeKeyboard';

export async function updateThemeConversion(
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
  await ctx.reply('What theme do you want to update?', {
    reply_markup: result.toFlowed(3).oneTime(true),
  });
  const existTheme = (await conversation.waitFor('message:text')).message.text;
  await ctx.reply('Write new theme name');
  const newThemeName = (
    await conversation.waitFor('message:text')
  ).message.text.toUpperCase();
  if (existTheme === newThemeName) {
    return await ctx.reply('The existing topic is the same as you renamed!');
  }
  const updateResult = await conversation.external(() => {
    return themeService.updateTheme(existTheme, newThemeName);
  });
  return await ctx.reply(updateResult);
}
