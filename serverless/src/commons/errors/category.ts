import { logErrorAndReturn } from '../log/logger.base';

export const Errors = {
  UNABLE_TO_LIST_CATEGORIES(...args: any): Error {
    const message = 'Unable to list categories';
    return logErrorAndReturn(message, ...args);
  }
};
