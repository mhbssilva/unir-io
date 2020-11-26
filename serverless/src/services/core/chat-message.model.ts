import { User } from "../../db/mysql/entities/user";

interface IChatMessageListOptions {
  user: User;
  otherUsersIdsIn?: string;
  idLessThan?: number;
  idMoreThan?: number;
  take?: number;
}

interface IChatMessageAddOptions {
  user: User;
  message: string;
  receiverUserId: number;
}

export { IChatMessageAddOptions, IChatMessageListOptions };
