import { AppDataSource } from '../db/data-source';
import { Question } from '../db/entity/Question';
import { Theme } from '../db/entity/Theme';
import { logger } from '../utils/logger/logger';

class QuestionService {
  private questionServiceRepository = AppDataSource.getRepository(Question);
  private themeServiceRepository = AppDataSource.getRepository(Theme);

  async addQuestion(
    themeName: string,
    text: string,
  ): Promise<string | { resultMessage: string; questionId: number }> {
    const trimmedText = text.trim();
    if (trimmedText.length === 0 || trimmedText.length < 3) {
      const tooShortMessage = `This text: "${trimmedText}" too short, must be, must be more than two characters`;
      logger.info(tooShortMessage);
      return tooShortMessage;
    }
    const theme = await this.themeServiceRepository.findOne({
      where: { themeName },
      relations: ['questions'],
    });
    if (theme === null) {
      const doesNotExistMessage = `Theme: "${themeName}" does not exist`;
      logger.info(doesNotExistMessage);
      return doesNotExistMessage;
    }
    const question = this.questionServiceRepository.create({
      questionText: trimmedText,
      themeThemeId: theme.themeId,
    });
    await this.questionServiceRepository.insert(question);
    theme.questions.push(question);
    const resultMessage = `Question: "${trimmedText}" successfully saved to "${themeName}" theme`;
    logger.info(resultMessage);
    return { resultMessage, questionId: question.questionId };
  }

  async getAllThemeQuestions(themeName: string): Promise<Question[] | string> {
    const theme = await this.themeServiceRepository.findOneBy({ themeName });
    if (theme === null) {
      const doesNotExistMessage = `Theme: "${themeName}" does not exist`;
      logger.info(doesNotExistMessage);
      return doesNotExistMessage;
    }
    return await this.questionServiceRepository.find({
      where: { themeThemeId: theme.themeId },
      relations: ['options'],
    });
  }

  async deleteQuestion(questionText: string): Promise<string> {
    const deletedQuestion = await this.questionServiceRepository.delete({
      questionText,
    });
    if (deletedQuestion.affected === 0) {
      const doesNotExistMessage = `Question: "${questionText}" does not exist`;
      logger.info(doesNotExistMessage);
      return doesNotExistMessage;
    }
    const okDeleted = `Question: "${questionText}" successfully deleted`;
    logger.info(okDeleted);
    return okDeleted;
  }

  async updateQuestion(
    questionText: string,
    newQuestionText: string,
  ): Promise<string> {
    const question = await this.questionServiceRepository.findOneBy({
      questionText,
    });
    if (question === null) {
      const doesNotExist = `Question: "${questionText}" does not exist`;
      logger.info(doesNotExist);
      return doesNotExist;
    }
    await this.questionServiceRepository.update(
      {
        questionText,
      },
      {
        questionText: newQuestionText,
      },
    );
    const resultMessage = `Question: from "${questionText}" to "${newQuestionText}" successfully updated`;
    logger.info(resultMessage);
    return resultMessage;
  }

  async getOneQuestion(questionText: string): Promise<string | Question> {
    const question = await this.questionServiceRepository.findOneBy({
      questionText,
    });
    if (question === null) {
      const doesNotExist = `Question: "${questionText}" does not exist`;
      logger.info(doesNotExist);
      return doesNotExist;
    }
    return question;
  }
}

export const questionService = new QuestionService();
