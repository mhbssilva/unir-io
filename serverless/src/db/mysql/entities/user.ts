import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'user'
})
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar'
  })
  uid: string;

  @Column({
    type: 'varchar'
  })
  displayName: string;

  @Column({
    type: 'varchar'
  })
  email: string;

  @Column({
    type: 'varchar'
  })
  photoUrl: string;

  @Column({
    type: 'varchar'
  })
  provider: string;

  @Column({
    type: 'datetime'
  })
  lastLoginAt: Date;

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
