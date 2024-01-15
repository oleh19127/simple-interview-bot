import { AppDataSource } from '../db/data-source';
import { Theme } from '../db/entity/Theme';
import { logger } from '../utils/logger/logger';

class ThemeService {
  private themeServiceRepository = AppDataSource.getRepository(Theme);

  async createTheme(themeName: string): Promise<string> {
    themeName = themeName.toUpperCase();
    const candidateName = await this.themeServiceRepository.existsBy({
      themeName,
    });
    if (candidateName) {
      logger.info(`Theme: "${themeName}" already exist`);
      return `Theme: "${themeName}" already exist`;
    }
    const newThemeName = new Theme();
    newThemeName.themeName = themeName;
    await this.themeServiceRepository.save(newThemeName);
    logger.info(`Theme: "${themeName}" successfully saved`);
    return `Theme: "${themeName}" successfully saved`;
  }

  async getAllThemes(): Promise<Theme[]> {
    const allThemes = await this.themeServiceRepository.find();
    return allThemes;
  }

  async deleteTheme(themeName: string): Promise<string> {
    themeName = themeName.toUpperCase();
    const candidateThemeToDelete = await this.themeServiceRepository.existsBy({
      themeName,
    });
    if (!candidateThemeToDelete) {
      logger.info(`Theme: "${themeName}" does not exist`);
      return `Theme: "${themeName}" does not exist`;
    }
    const destroyedTheme = await this.themeServiceRepository.delete({
      themeName,
    });
    if (destroyedTheme.affected === 1) {
      logger.info(`Theme: "${themeName}" successfully deleted`);
      return `Theme: "${themeName}" successfully deleted`;
    }
    logger.info('Something went wrong');
    return 'Something went wrong';
  }
}

export const themeService = new ThemeService();
