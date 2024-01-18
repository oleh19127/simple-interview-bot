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
    option.questionQuestionId = question.questionId;
    await this.optionServiceRepository.save(option);
    question.options.push(option);
    await this.questionServiceRepository.save(question);
    const resultMessage = `Option: "${optionText}" successfully saved to "${question.questionText}" question`;
    logger.info(resultMessage);
    return resultMessage;
  }
  async getQuestionOptions(questionText: string): Promise<string | Option[]> {
    const question = await this.questionServiceRepository.findOne({
      where: {
        questionText,
      },
      relations: ['options'],
    });
    if (question === null) {
      const doesNotExist = `Question: "${questionText}" does not exist`;
      logger.info(doesNotExist);
      return doesNotExist;
    }
    return question.options;
  }
  async deleteOption(optionText: string): Promise<string> {
    const deletedOption = await this.optionServiceRepository.delete({
      optionText,
    });
    if (deletedOption.affected === 0) {
      const doesNotExistMessage = `Option: "${optionText}" does not exist`;
      logger.info(doesNotExistMessage);
      return doesNotExistMessage;
    }
    const okDeleted = `Option: "${optionText}" successfully deleted`;
    logger.info(okDeleted);
    return okDeleted;
  }

  async updateOption(
    optionText: string,
    newOptionText: string,
    isCorrect: boolean,
  ): Promise<string> {
    const option = await this.optionServiceRepository.findOneBy({ optionText });
    if (option === null) {
      const doesNotExist = `Option: "${optionText}" does not exist`;
      logger.info(doesNotExist);
      return doesNotExist;
    }
    option.optionText = newOptionText;
    option.isCorrect = isCorrect;
    await this.optionServiceRepository.save(option);
    const resultMessage = `Option: from "${optionText}" to "${newOptionText}" successfully updated`;
    logger.info(resultMessage);
    return resultMessage;
  }
}

export const optionService = new OptionService();
