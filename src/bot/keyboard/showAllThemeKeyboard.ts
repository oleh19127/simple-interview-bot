import { Keyboard } from 'grammy';
import { themeService } from '../../services/ThemeService';
import { logger } from '../../utils/logger/logger';

export const showAllThemeKeyboard = async (): Promise<string | Keyboard> => {
  const allThemes = await themeService.getAllThemes();
  if (allThemes.length === 0) {
    logger.info('No themes to display\nTo create theme: /add_theme');
    return 'No themes to display\nTo create theme: /add_theme';
  }
  const startKeyboard = new Keyboard().resized();
  for (const theme of allThemes) {
    startKeyboard.add(theme.themeName);
  }
  return startKeyboard;
};
