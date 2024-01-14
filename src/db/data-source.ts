import { DataSource } from 'typeorm';
import { Theme } from './entity/Theme';
import { Question } from './entity/Question';
import { Option } from './entity/Option';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: './simple-interview-bot.sqlite',
  synchronize: true,
  logging: true,
  entities: [Theme, Question, Option],
  logger: 'advanced-console',
});
