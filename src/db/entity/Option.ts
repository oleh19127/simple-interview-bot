import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './Question';

@Entity()
export class Option {
  @PrimaryGeneratedColumn({ type: 'int' })
  optionId: number;

  @Column({ type: 'text' })
  optionText: string;

  @Column({ type: 'boolean' })
  isCorrect: boolean;

  @Column({ type: 'int' })
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
