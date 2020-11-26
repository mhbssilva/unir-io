import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Category } from './category';
import { Notification } from './notification';

@Entity({
  name: 'notification_category'
})
export class NotificationCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int'
  })
  notificationId: number;

  @Column({
    type: 'int'
  })
  categoryId: number;

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

  @ManyToOne(
    () => Category,
    category => category.id
  )
  @JoinColumn({ name: 'categoryId', referencedColumnName: 'id' })
  category: Category;

  @ManyToOne(
    () => Notification,
    notification => notification.id
  )
  @JoinColumn({ name: 'notificationId', referencedColumnName: 'id' })
  notification: Notification;
}
