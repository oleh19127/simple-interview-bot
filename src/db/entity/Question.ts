import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Theme } from './Theme';
import { Option } from './Option';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  questionId: number;

  @Column()
  questionText: string;

  @Column()
  themeThemeId: number;

  @ManyToOne(() => Theme, (theme) => theme.questions, {
    onDelete: 'CASCADE',
  })
  theme: Theme;

  @OneToMany(() => Option, (option) => option.question)
  @JoinTable()
  options: Option[];
}
