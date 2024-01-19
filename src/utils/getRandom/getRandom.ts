import { Random } from 'random-js';
import { questionService } from '../../services/QuestionService';
import { Question } from '../../db/entity/Question';

class GetRandom {
  private random = new Random();
  async question(themeName: string): Promise<Question> {
    const allQuestions = await questionService.getAllThemeQuestions(themeName);
    const randomIndexOfArray = this.random.integer(0, allQuestions.length - 1);
    const randomQuestion = allQuestions[randomIndexOfArray];
    return randomQuestion;
  }
}

export const getRandom = new GetRandom();
