import { logErrorAndReturn } from '../log/logger.base';

export const Errors = {
  UNABLE_TO_LIST_CHAT_MESSAGES(...args: any): Error {
    const message = 'Unable to list chat messages';
    return logErrorAndReturn(message, ...args);
  },
  UNABLE_TO_ADD_CHAT_MESSAGE(...args: any): Error {
    const message = 'Unable to add chat message';
    return logErrorAndReturn(message, ...args);
  }
};
