import { AppDataSource } from '../db/data-source';
import { Theme } from '../db/entity/Theme';
import { logger } from '../utils/logger/logger';

class ThemeService {
  private themeServiceRepository = AppDataSource.getRepository(Theme);

  async createTheme(themeName: string): Promise<string> {
    const localThemeName = themeName.toUpperCase();
    const candidateName = await this.themeServiceRepository.existsBy({
      themeName: localThemeName,
    });
    if (candidateName) {
      const alreadyExistMessage = `Theme: "${localThemeName}" already exist`;
      logger.info(alreadyExistMessage);
      return alreadyExistMessage;
    }
    const theme = this.themeServiceRepository.create({
      themeName: localThemeName,
    });
    await this.themeServiceRepository.insert(theme);
    const resultMessage = `Theme: "${localThemeName}" successfully saved`;
    logger.info(resultMessage);
    return resultMessage;
  }

  async getAllThemes(): Promise<Theme[]> {
    return await this.themeServiceRepository.find({
      relations: ['questions'],
    });
  }

  async deleteTheme(themeName: string): Promise<string> {
    const localThemeName = themeName.toUpperCase();
    const destroyedTheme = await this.themeServiceRepository.delete({
      themeName: localThemeName,
    });
    if (destroyedTheme.affected === 0) {
      const doesNotExistMessage = `Theme: "${localThemeName}" does not exist`;
      logger.info(doesNotExistMessage);
      return doesNotExistMessage;
    }
    const okDeleted = `Theme: "${localThemeName}" successfully deleted`;
    logger.info(okDeleted);
    return okDeleted;
  }

  async updateTheme(themeName: string, newThemeName: string): Promise<string> {
    const theme = await this.themeServiceRepository.findOneBy({
      themeName,
    });
    if (theme === null) {
      const doesNotExist = `Theme: "${themeName}" does not exist`;
      logger.info(doesNotExist);
      return doesNotExist;
    }
    const localNewThemeName = newThemeName.toUpperCase();
    await this.themeServiceRepository.update(
      {
        themeName,
      },
      {
        themeName: localNewThemeName,
      },
    );
    const resultMessage = `Theme: from "${themeName}" to "${localNewThemeName}" successfully updated`;
    logger.info(resultMessage);
    return resultMessage;
  }
}

export const themeService = new ThemeService();
