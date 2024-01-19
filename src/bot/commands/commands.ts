import { addThemeCommand } from './addThemeCommand';
import { getRandomQuestionCommand } from './getRandomQuestionCommand';
import { updateOptionCommand } from './updateOptionCommand';
import { updateThemeCommand } from './updateThemeCommand';
import { deleteThemeCommand } from './deleteThemeCommand';
import { addQuestionCommand } from './addQuestionCommand';
import { updateQuestionCommand } from './updateQuestionCommand';
import { addOptionCommand } from './addOptionCommand';
import { deleteQuestionCommand } from './deleteQuestionCommand';
import { deleteOptionCommand } from './deleteOptionCommand';
import { startCommand } from './startCommand';
import { helpCommand } from './helpCommand';

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
