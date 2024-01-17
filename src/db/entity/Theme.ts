import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from './Question';

@Entity()
export class Theme {
  @PrimaryGeneratedColumn()
  themeId: number;

  @Column({ unique: true })
  themeName: string;

  @OneToMany(() => Question, (question) => question.theme, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  questions: Question[];
}
