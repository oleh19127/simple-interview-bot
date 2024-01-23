import { themeService } from '../../services/ThemeService';
import { userService } from '../../services/UserService';
import { MyContext, MyConversation } from '../bot';
import { generateThemeKeyboard } from '../keyboards/generateThemeKeyboard';

export async function deleteThemeConversion(
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
  await ctx.reply('What theme do you want to delete?', {
    reply_markup: result.toFlowed(3).oneTime(true),
  });
  const { message } = await conversation.wait();
  const deletedResult = await conversation.external(() => {
    return themeService.deleteTheme(message?.text as string);
  });
  return await ctx.reply(deletedResult);
}
