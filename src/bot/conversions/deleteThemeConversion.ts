import { themeService } from '../../services/ThemeService';
import { generateThemeKeyboard } from '../keyboards/generateThemeKeyboard';
import { MyContext, MyConversation } from '../bot';

export async function deleteThemeConversion(
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
  await ctx.reply('What theme do you want to delete?', {
    reply_markup: result.toFlowed(3).oneTime(true),
  });
  const { message } = await conversation.wait();
  const deletedResult = await conversation.external(() => {
    return themeService.deleteTheme(message?.text as string);
  });
  return await ctx.reply(deletedResult);
}
