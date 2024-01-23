import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from './Question';
import { User } from './User';

@Entity()
export class Theme {
  @PrimaryGeneratedColumn()
  themeId: number;

  @Column({ unique: true })
  themeName: string;

  @Column()
  userUserId: number;

  @OneToMany(
    () => Question,
    (question) => question.theme,
  )
  @JoinTable()
  questions: Question[];
  @ManyToOne(
    () => User,
    (user) => user.themes,
    {
      onDelete: 'CASCADE',
    },
  )
  user: User;
}
