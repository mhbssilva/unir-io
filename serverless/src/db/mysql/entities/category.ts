import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany
} from 'typeorm';
import { Notification } from './notification';
import { Publication } from './publication';

@Entity({
  name: 'category'
})
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar'
  })
  name: string;

  @Column({
    type: 'datetime'
  })
  createdAt: Date;

  @Column({
    type: 'datetime'
  })
  updatedAt: Date;

  @Column({
    type: 'datetime'
  })
  deletedAt: Date;

  @ManyToMany(
    () => Notification,
    notification => notification.categories
  )
  notifications: Notification[];

  @ManyToMany(
    () => Publication,
    publication => publication.categories
  )
  publications: Publication[];
}
