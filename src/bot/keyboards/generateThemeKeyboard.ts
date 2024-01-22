import { Keyboard } from 'grammy';
import { Theme } from '../../db/entity/Theme';
import { logger } from '../../utils/logger/logger';

export const generateThemeKeyboard = async (
  array: Theme[],
): Promise<string | Keyboard> => {
  if (array.length === 0) {
    logger.info('No themes to display\nTo create theme: /add_theme');
    return 'No themes to display\nTo create theme: /add_theme';
  }
  const themeKeyboard = new Keyboard().resized();
  for (const theme of array) {
    themeKeyboard.add(theme.themeName);
  }
  return themeKeyboard;
};
