import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Option } from './Option';
import { Theme } from './Theme';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  questionId: number;

  @Column()
  questionText: string;

  @Column()
  themeThemeId: number;

  @ManyToOne(
    () => Theme,
    (theme) => theme.questions,
    {
      onDelete: 'CASCADE',
    },
  )
  theme: Theme;

  @OneToMany(
    () => Option,
    (option) => option.question,
  )
  @JoinTable()
  options: Option[];
}
