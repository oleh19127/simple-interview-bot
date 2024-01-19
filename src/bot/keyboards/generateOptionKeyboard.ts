import { Keyboard } from 'grammy';
import { Option } from '../../db/entity/Option';
import { logger } from '../../utils/logger/logger';

export const generateOptionKeyboard = async (
  array: Option[],
): Promise<string | Keyboard> => {
  if (array.length === 0) {
    logger.info(
      'No Option to display\nTo create question and option: /add_question\nTo create option: /add_option',
    );
    return 'No Option to display\nTo create question and option: /add_question\nTo create option: /add_option';
  }
  const optionKeyboard = new Keyboard().resized();
  for (const option of array) {
    optionKeyboard.add(option.optionText);
  }
  return optionKeyboard;
};
