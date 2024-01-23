import { userService } from '../../services/UserService';
import { MyContext, MyConversation } from '../bot';

export async function getAllUsersConversation(
  conversation: MyConversation,
  ctx: MyContext,
) {
  const arrayOfAllUsers = await conversation.external(() => {
    return userService.getAllUsers();
  });
  if (arrayOfAllUsers.length === 0) {
    return await ctx.reply('No users');
  }
  const userNames: string[] = [];
  for (const user of arrayOfAllUsers) {
    userNames.push(user.userName);
  }
  const formattedUserNames = userNames.join('\n');
  return await ctx.reply(formattedUserNames);
}
