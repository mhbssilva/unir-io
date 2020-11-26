import { APIGatewayProxyHandler } from "aws-lambda";
import middy from "middy";
import { doNotWaitForEmptyEventLoop } from "middy/middlewares";
import "source-map-support/register";
import { ChatMessage } from "../db/mysql/entities/chat-message";
import ChatMessageService from "../services/core/chat-message";
import {
  IChatMessageAddOptions,
  IChatMessageListOptions,
} from "../services/core/chat-message.model";
import { classToObject } from "../utils/object.helper";
import { BaseResponse as response } from "./base.model";
import { authenticate } from "./middleware/auth";
import { updateLastActivityDate } from "./middleware/user";

const listHandler: APIGatewayProxyHandler = async (event: any, _context) => {
  try {
    const options: IChatMessageListOptions = {
      ...event.queryStringParameters,
      user: event.authUser,
    };

    const chatMessageService = new ChatMessageService();
    const chatMessages: Array<ChatMessage> = await chatMessageService.list(
      options
    );

    return response.success(classToObject(chatMessages));
  } catch (e) {
    return response.error(e);
  }
};

const addHandler: APIGatewayProxyHandler = async (event: any, _context) => {
  try {
    const options: IChatMessageAddOptions = {
      ...JSON.parse(event.body),
      user: event.authUser,
    };

    const chatMessageService = new ChatMessageService();
    const chatMessage: ChatMessage = await chatMessageService.add(options);

    return response.success(classToObject(chatMessage));
  } catch (e) {
    return response.error(e);
  }
};

const list = middy(listHandler)
  .use(authenticate())
  .use(updateLastActivityDate())
  .use(doNotWaitForEmptyEventLoop());

const add = middy(addHandler)
  .use(authenticate())
  .use(updateLastActivityDate())
  .use(doNotWaitForEmptyEventLoop());

export { add, list };
