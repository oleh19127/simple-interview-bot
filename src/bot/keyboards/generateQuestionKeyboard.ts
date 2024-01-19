import { Keyboard } from 'grammy';
import { Question } from '../../db/entity/Question';
import { logger } from '../../utils/logger/logger';

export const generateQuestionKeyboard = async (
  array: Question[],
): Promise<string | Keyboard> => {
  if (array.length === 0) {
    const noQuestionsMessage =
      'No question to display\nTo create question: /add_question';
    logger.info(noQuestionsMessage);
    return noQuestionsMessage;
  }
  const questionKeyboard = new Keyboard().resized();
  for (const question of array) {
    questionKeyboard.add(question.questionText);
  }
  return questionKeyboard;
};
