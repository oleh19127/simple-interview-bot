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
    text = text.trim();
    if (text.length === 0 || text.length < 3) {
      const tooShortMessage = `This text: "${text}" too short, must be, must be more than two characters`;
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
    const question = new Question();
    question.questionText = text;
    await this.questionServiceRepository.save(question);
    theme.questions.push(question);
    await this.themeServiceRepository.save(theme);
    const resultMessage = `Question: "${text}" successfully saved to "${themeName}" theme`;
    logger.info(resultMessage);
    return { resultMessage, questionId: question.questionId };
  }

  async getAllQuestions(): Promise<Question[]> {
    return await this.questionServiceRepository.find({
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
    question.questionText = newQuestionText;
    await this.questionServiceRepository.save(question);
    const resultMessage = `Question: from "${questionText}" to "${newQuestionText}" successfully updated`;
    logger.info(resultMessage);
    return resultMessage;
  }
}

export const questionService = new QuestionService();
