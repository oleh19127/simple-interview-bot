import { DataSource } from 'typeorm';
import { Option } from './entity/Option';
import { Question } from './entity/Question';
import { Theme } from './entity/Theme';
import { User } from './entity/User';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: './simple-interview-bot.sqlite',
  synchronize: true,
  logging: true,
  entities: [User, Theme, Question, Option],
  logger: 'advanced-console',
});
