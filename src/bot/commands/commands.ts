import { addOptionCommand } from './addOptionCommand';
import { addQuestionCommand } from './addQuestionCommand';
import { addThemeCommand } from './addThemeCommand';
import { deleteOptionCommand } from './deleteOptionCommand';
import { deleteQuestionCommand } from './deleteQuestionCommand';
import { deleteThemeCommand } from './deleteThemeCommand';
import { getRandomQuestionCommand } from './getRandomQuestionCommand';
import { helpCommand } from './helpCommand';
import { startCommand } from './startCommand';
import { updateOptionCommand } from './updateOptionCommand';
import { updateQuestionCommand } from './updateQuestionCommand';
import { updateThemeCommand } from './updateThemeCommand';

export const commands = [
  getRandomQuestionCommand,
  addThemeCommand,
  updateThemeCommand,
  deleteThemeCommand,
  addQuestionCommand,
  updateQuestionCommand,
  deleteQuestionCommand,
  addOptionCommand,
  updateOptionCommand,
  deleteOptionCommand,
  startCommand,
  helpCommand,
];
