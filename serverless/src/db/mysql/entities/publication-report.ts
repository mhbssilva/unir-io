import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Publication } from './publication';

@Entity({
  name: 'publication_report'
})
export class PublicationReport extends BaseEntity {
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
    type: 'text'
  })
  description: string;

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
    publication => publication.reports
  )
  publication: Publication;
}
