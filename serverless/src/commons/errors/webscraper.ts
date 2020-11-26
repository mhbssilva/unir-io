import { logErrorAndReturn } from '../log/logger.base';

export const Errors = {
  COULD_NOT_GET_GENERAL_NEWS_FROM_UNIRIO(...args: any): Error {
    const message = 'Could not get general news from UNIRIO';
    return logErrorAndReturn(message, ...args);
  },
  COULD_NOT_SAVE_GENERAL_NEWS_OBTAINED_FROM_UNIRIO(...args: any): Error {
    const message = 'Could not save general news obtained from UNIRIO';
    return logErrorAndReturn(message, ...args);
  },
  COULD_NOT_GET_RESTAURANT_NEWS_FROM_UNIRIO(...args: any): Error {
    const message = 'Could not get restaurant news from UNIRIO';
    return logErrorAndReturn(message, ...args);
  },
  COULD_NOT_SAVE_RESTAURANT_NEWS_OBTAINED_FROM_UNIRIO(...args: any): Error {
    const message = 'Could not save restaurant news obtained from UNIRIO';
    return logErrorAndReturn(message, ...args);
  }
};
