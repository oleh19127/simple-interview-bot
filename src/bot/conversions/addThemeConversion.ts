import { themeService } from '../../services/ThemeService';
import { MyContext, MyConversation } from '../bot';

export async function addThemeConversation(
  conversation: MyConversation,
  ctx: MyContext,
) {
  await ctx.reply('What theme do you want to add?');
  const { message } = await conversation.wait();
  const result = await conversation.external(() => {
    return themeService.createTheme(message?.text as string);
  });
  return await ctx.reply(result);
}
