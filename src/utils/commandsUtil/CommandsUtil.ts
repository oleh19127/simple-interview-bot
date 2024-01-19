import { logger } from '../logger/logger';

class CommandsUtil {
  async getHelpText(
    commands: { command: string; description: string }[],
  ): Promise<string> {
    if (commands.length === 0) {
      const noCommandsToDisplayMessage = 'No commandsUtil to display';
      logger.info(noCommandsToDisplayMessage);
      return noCommandsToDisplayMessage;
    }
    const arrHelpText: string[] = [];
    for (const command of commands) {
      const commandAndDescription = `Command: /${command.command}\nDescription: ${command.description}`;
      arrHelpText.push(commandAndDescription);
    }
    return arrHelpText.join('\n\n');
  }
}

export const commandsUtil = new CommandsUtil();
