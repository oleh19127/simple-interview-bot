import { AppDataSource } from '../db/data-source';
import { Option } from '../db/entity/Option';
import { Question } from '../db/entity/Question';
import { logger } from '../utils/logger/logger';

class OptionService {
  private optionServiceRepository = AppDataSource.getRepository(Option);
  private questionServiceRepository = AppDataSource.getRepository(Question);

  async addOption(
    optionText: string,
    isCorrect: boolean,
    questionId: number,
  ): Promise<string> {
    const question = await this.questionServiceRepository.findOne({
      where: { questionId },
      relations: ['options'],
    });
    if (question === null) {
      const doesNotExistMessage = `Question does not exist`;
      logger.info(doesNotExistMessage);
      return doesNotExistMessage;
    }
    optionText = optionText.trim();
    const option = new Option();
    option.isCorrect = isCorrect;
    option.optionText = optionText;
    await this.optionServiceRepository.save(option);
    question.options.push(option);
    await this.questionServiceRepository.save(question);
    const resultMessage = `Option: "${optionText}" successfully saved to "${question.questionText}" question`;
    logger.info(resultMessage);
    return resultMessage;
  }
}

export const optionService = new OptionService();
