import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Theme } from './Theme';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ unique: true })
  username: string;

  @OneToMany(
    () => Theme,
    (theme) => theme.user,
  )
  themes: Theme[];
}
