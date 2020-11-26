import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Category } from './category';
import { Publication } from './publication';

@Entity({
  name: 'publication_category'
})
export class PublicationCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int'
  })
  publicationId: number;

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
    () => Publication,
    publication => publication.id
  )
  @JoinColumn({ name: 'publicationId', referencedColumnName: 'id' })
  publication: Publication;
}
