import { themeService } from '../../services/ThemeService';
import { userService } from '../../services/UserService';
import { MyContext, MyConversation } from '../bot';

export async function addThemeConversation(
  conversation: MyConversation,
  ctx: MyContext,
) {
  await ctx.reply('What theme do you want to add?');
  const { message } = await conversation.wait();
  const user = await conversation.external(() => {
    return userService.getOneUser(ctx.from?.username as string);
  });
  if (typeof user === 'string') {
    return await ctx.reply(user);
  }
  const result = await conversation.external(() => {
    return themeService.createTheme(message?.text as string, user.userId);
  });
  return await ctx.reply(result);
}
