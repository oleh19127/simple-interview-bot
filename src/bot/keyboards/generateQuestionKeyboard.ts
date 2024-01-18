import { Keyboard } from 'grammy';
import { Question } from '../../db/entity/Question';
import { logger } from '../../utils/logger/logger';

export const generateQuestionKeyboard = async (
  array: Question[],
): Promise<string | Keyboard> => {
  if (array.length === 0) {
    logger.info('No Question to display\nTo create theme: /add_question');
    return 'No Question to display\nTo create theme: /add_question';
  }
  const questionKeyboard = new Keyboard().resized();
  for (const question of array) {
    questionKeyboard.add(question.questionText);
  }
  return questionKeyboard;
};
