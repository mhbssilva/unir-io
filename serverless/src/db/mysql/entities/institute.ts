import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'institute'
})
export class Institute extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar'
  })
  displayName: string;

  @Column({
    type: 'varchar'
  })
  fullName: string;

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
}
