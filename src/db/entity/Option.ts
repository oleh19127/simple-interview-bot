import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './Question';

@Entity()
export class Option {
  @PrimaryGeneratedColumn()
  optionId: number;

  @Column()
  optionText: string;

  @Column()
  isCorrect: boolean;

  @Column()
  questionQuestionId: number;

  @ManyToOne(
    () => Question,
    (question) => question.options,
    {
      onDelete: 'CASCADE',
    },
  )
  question: Question;
}
