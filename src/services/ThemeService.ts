import { AppDataSource } from '../db/data-source';
import { Theme } from '../db/entity/Theme';
import { logger } from '../utils/logger/logger';

class ThemeService {
  private themeServiceRepository = AppDataSource.getRepository(Theme);

  async createTheme(themeName: string): Promise<string> {
    const candidateName = await this.themeServiceRepository.exists({
      where: { themeName },
    });
    if (candidateName) {
      logger.info(`${themeName} already exist`);
      return `"${themeName}" already exist`;
    }
    const newThemeName = new Theme();
    newThemeName.themeName = themeName;
    await this.themeServiceRepository.save(newThemeName);
    logger.info(`"${themeName}" successfully saved`);
    return `"${themeName}" successfully saved`;
  }

  async getAllThemes(): Promise<Theme[]> {
    const allThemes = await this.themeServiceRepository.find();
    return allThemes;
  }
}

export const themeService = new ThemeService();
