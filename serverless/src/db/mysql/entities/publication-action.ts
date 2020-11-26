import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Publication } from './publication';

enum ActionType {
  LIKE = 'like',
  DISLIKE = 'dislike'
}

@Entity({
  name: 'publication_action'
})
export class PublicationAction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int'
  })
  publicationId: number;

  @Column({
    type: 'int'
  })
  userId: number;

  @Column({
    type: 'enum',
    enum: ActionType
  })
  actionType: ActionType;

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
    () => Publication,
    publication => publication.actions
  )
  publication: Publication;
}
