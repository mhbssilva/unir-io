import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Category } from './category';
import { PublicationAction } from './publication-action';
import { PublicationComment } from './publication-comment';
import { PublicationReport } from './publication-report';
import { User } from './user';

@Entity({
  name: 'publication'
})
export class Publication extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int'
  })
  instituteId: number;

  @Column({
    type: 'int'
  })
  userId: number;

  @Column({
    type: 'text'
  })
  content: string;

  @Column({
    type: 'varchar'
  })
  imageUrl: string;

  @Column({
    type: 'tinyint'
  })
  isAnonymous: number;

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
    category => category.publications
  )
  @JoinTable({
    name: 'publication_category',
    joinColumn: { name: 'publicationId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' }
  })
  categories: Category[];

  @OneToMany(
    () => PublicationAction,
    action => action.publication
  )
  actions: PublicationAction[];

  @OneToMany(
    () => PublicationComment,
    comment => comment.publication
  )
  comments: PublicationComment[];

  @OneToMany(
    () => PublicationReport,
    report => report.publication
  )
  reports: PublicationReport[];

  @ManyToOne(
    () => User,
    user => user.id
  )
  user: User;
}
