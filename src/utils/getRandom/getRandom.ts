import { Random } from 'random-js';
import { questionService } from '../../services/QuestionService';
import { Question } from '../../db/entity/Question';
import { logger } from '../logger/logger';

class GetRandom {
  private random = new Random();
  async question(themeName: string): Promise<string | Question> {
    const allQuestions = await questionService.getAllThemeQuestions(themeName);
    if (typeof allQuestions === 'string') {
      return allQuestions;
    }
    if (allQuestions.length === 0) {
      const doesNotExist =
        'No question to display\nTo create question: /add_question';
      logger.info(doesNotExist);
      return doesNotExist;
    }
    const randomIndexOfArray = this.random.integer(0, allQuestions.length - 1);
    return allQuestions[randomIndexOfArray];
  }
}

export const getRandom = new GetRandom();
