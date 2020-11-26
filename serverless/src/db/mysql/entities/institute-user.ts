import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'institute_user'
})
export class InstituteUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int'
  })
  userId: number;

  @Column({
    type: 'int'
  })
  instituteId: number;

  @Column({
    type: 'tinyint'
  })
  enabled: number;

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
