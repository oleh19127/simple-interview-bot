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
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ unique: true })
  userName: string;

  @OneToMany(
    () => Theme,
    (theme) => theme.user,
  )
  @JoinTable()
  themes: Theme[];
}
