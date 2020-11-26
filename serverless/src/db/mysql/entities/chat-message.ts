import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'chat_message'
})
export class ChatMessage extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int'
  })
  senderUserId: number;

  @Column({
    type: 'int'
  })
  receiverUserId: number;

  @Column({
    type: 'text'
  })
  message: string;

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
