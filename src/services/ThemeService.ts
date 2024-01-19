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
      const alreadyExistMessage = `Theme: "${themeName}" already exist`;
      logger.info(alreadyExistMessage);
      return alreadyExistMessage;
    }
    const newThemeName = new Theme();
    newThemeName.themeName = themeName;
    await this.themeServiceRepository.save(newThemeName);
    const resultMessage = `Theme: "${themeName}" successfully saved`;
    logger.info(resultMessage);
    return resultMessage;
  }

  async getAllThemes(): Promise<Theme[]> {
    return await this.themeServiceRepository.find({
      relations: ['questions'],
    });
  }

  async deleteTheme(themeName: string): Promise<string> {
    themeName = themeName.toUpperCase();
    const destroyedTheme = await this.themeServiceRepository.delete({
      themeName,
    });
    if (destroyedTheme.affected === 0) {
      const doesNotExistMessage = `Theme: "${themeName}" does not exist`;
      logger.info(doesNotExistMessage);
      return doesNotExistMessage;
    }
    const okDeleted = `Theme: "${themeName}" successfully deleted`;
    logger.info(okDeleted);
    return okDeleted;
  }

  async updateTheme(themeName: string, newThemeName: string): Promise<string> {
    themeName = themeName.toUpperCase();
    const theme = await this.themeServiceRepository.findOneBy({
      themeName,
    });
    if (theme === null) {
      const doesNotExist = `Theme: "${themeName}" does not exist`;
      logger.info(doesNotExist);
      return doesNotExist;
    }
    newThemeName = newThemeName.toUpperCase();
    theme.themeName = newThemeName;
    await this.themeServiceRepository.save(theme);
    const resultMessage = `Theme: from "${themeName}" to "${newThemeName}" successfully updated`;
    logger.info(resultMessage);
    return resultMessage;
  }
}

export const themeService = new ThemeService();
