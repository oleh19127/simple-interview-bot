import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Theme } from './Theme';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'int' })
  userId: number;

  @Column({ unique: true, type: 'text' })
  userName: string;

  @OneToMany(
    () => Theme,
    (theme) => theme.user,
  )
  @JoinTable()
  themes: Theme[];
}
