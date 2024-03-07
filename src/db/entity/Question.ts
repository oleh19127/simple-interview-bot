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
  @PrimaryGeneratedColumn({ type: 'int' })
  questionId: number;

  @Column({ type: 'text' })
  questionText: string;

  @Column({ type: 'int' })
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
