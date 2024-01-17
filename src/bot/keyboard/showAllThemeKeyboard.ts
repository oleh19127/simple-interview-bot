import { Keyboard } from 'grammy';
import { logger } from '../../utils/logger/logger';
import { Theme } from '../../db/entity/Theme';

export const generateKeyboard = async (
  array: Theme[],
): Promise<string | Keyboard> => {
  logger.info('Keyboard');
  if (array.length === 0) {
    logger.info('No themes to display\nTo create theme: /add_theme');
    return 'No themes to display\nTo create theme: /add_theme';
  }
  const startKeyboard = new Keyboard().resized();
  for (const theme of array) {
    startKeyboard.add(theme.themeName);
  }
  return startKeyboard;
};

// export async function generateKeyboard(
//   array: Theme[],
// ): Promise<string | Keyboard> {
//   logger.info('Keyboard');
//   if (array.length === 0) {
//     logger.info('No themes to display\nTo create theme: /add_theme');
//     return 'No themes to display\nTo create theme: /add_theme';
//   }
//   const startKeyboard = new Keyboard().resized();
//   for (const theme of array) {
//     startKeyboard.add(theme.themeName);
//   }
//   return startKeyboard;
// }
