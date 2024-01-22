import { userService } from '../../services/UserService';
import { commandsUtil } from '../../utils/commandsUtil/CommandsUtil';
import { MyContext, MyConversation } from '../bot';
import { commands } from '../commands/commands';

export async function startConversation(
  conversation: MyConversation,
  ctx: MyContext,
) {
  await ctx.api.setMyCommands(commands);
  const checkUser = await conversation.external(() => {
    return userService.createUser(ctx.from?.username as string);
  });
  await ctx.reply(checkUser);
  return await ctx.reply(await commandsUtil.getHelpText(commands));
}
