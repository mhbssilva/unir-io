import _ from "lodash";
import moment from "moment";
import { Connection, FindManyOptions, In, LessThan, MoreThan } from "typeorm";
import { Errors } from "../../commons/errors/chat-message";
import { ChatMessage } from "../../db/mysql/entities/chat-message";
import { BaseService } from "./base";
import {
  IChatMessageAddOptions,
  IChatMessageListOptions,
} from "./chat-message.model";

type ChatMessageServiceList = (
  options?: IChatMessageListOptions
) => Promise<ChatMessage[]>;
type ChatMessageServiceAdd = (
  options?: IChatMessageAddOptions
) => Promise<ChatMessage>;
type ChatMessageServiceFilterOptions = (
  options?: IChatMessageListOptions
) => FindManyOptions<ChatMessage>;

class ChatMessageService extends BaseService {
  /**
   * List all chat messages from database.
   */
  list: ChatMessageServiceList = async (options?: IChatMessageListOptions) => {
    try {
      const filteredOptions = this.filterOptions(options);
      const db: Connection = await this.getDb();
      const chatMessageList: Array<ChatMessage> = await db
        .getRepository(ChatMessage)
        .find({
          ...filteredOptions,
        });
      return chatMessageList;
    } catch (error) {
      throw Errors.UNABLE_TO_LIST_CHAT_MESSAGES({ error });
    }
  };

  /**
   * Adds a chat message to database.
   */
  add: ChatMessageServiceAdd = async (options?: IChatMessageAddOptions) => {
    try {
      const { user } = options;
      const db: Connection = await this.getDb();
      let dbChatMessage: ChatMessage = new ChatMessage();

      dbChatMessage.senderUserId = user.id;
      dbChatMessage.message = options.message ?? null;
      dbChatMessage.receiverUserId = options.receiverUserId;
      dbChatMessage.createdAt = moment().toDate();
      dbChatMessage.updatedAt = moment().toDate();

      return await db.getRepository(ChatMessage).save(dbChatMessage);
    } catch (error) {
      throw Errors.UNABLE_TO_ADD_CHAT_MESSAGE({ error });
    }
  };

  /**
   * Filter options from handlers
   * and entry points to make it
   * usable on service methods.
   */
  filterOptions: ChatMessageServiceFilterOptions = (
    options?: IChatMessageListOptions
  ) => {
    const { user } = options;

    let filter: FindManyOptions<ChatMessage> = {
      where: [
        {
          senderUserId: user.id,
        },
        {
          receiverUserId: user.id,
        },
      ],
      order: {
        createdAt: "DESC",
      },
      take: 20,
    };

    if (!options) {
      return filter;
    }

    if (options.otherUsersIdsIn) {
      const otherUsersIds = options.otherUsersIdsIn.split(",");
      filter.where = [
        {
          receiverUserId: In(otherUsersIds),
          senderUserId: user.id,
        },
        {
          senderUserId: In(otherUsersIds),
          receiverUserId: user.id,
        },
      ];
    }

    if (options.idLessThan) {
      filter.where = _.map(filter.where, (f: any) => ({
        ...f,
        id: LessThan(options.idLessThan),
      }));
    } else if (options.idMoreThan) {
      filter.where = _.map(filter.where, (f: any) => ({
        ...f,
        id: MoreThan(options.idMoreThan),
      }));
    }

    if (options.take) {
      filter.take = options.take && options.take < 200 ? options.take : 200;
    }

    return filter;
  };
}

export default ChatMessageService;
