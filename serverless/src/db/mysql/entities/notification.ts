import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { Category } from './category';

@Entity({
  name: 'notification'
})
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int'
  })
  instituteId: number;

  @Column({
    type: 'varchar'
  })
  title: string;

  @Column({
    type: 'varchar'
  })
  description: string;

  @Column({
    type: 'text'
  })
  content: string;

  @Column({
    type: 'varchar'
  })
  contentUrl: string;

  @Column({
    type: 'varchar'
  })
  imageUrl: string;

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
    () => Category,
    category => category.notifications
  )
  @JoinTable({
    name: 'notification_category',
    joinColumn: { name: 'notificationId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' }
  })
  categories: Category[];
}
