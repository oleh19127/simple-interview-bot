import {
  Column,
  Entity,
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
  text: string;

  @ManyToOne(() => Theme, (theme) => theme.questions)
  theme: Theme;

  @OneToMany(() => Option, (option) => option.question)
  options: Option[];
}
