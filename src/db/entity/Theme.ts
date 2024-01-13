import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './Question';

@Entity()
export class Theme {
  @PrimaryGeneratedColumn()
  themeId: number;

  @Column()
  name: string;

  @OneToMany(() => Question, (question) => question.theme)
  questions: Question[];
}
