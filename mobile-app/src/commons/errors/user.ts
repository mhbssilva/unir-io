import { logErrorAndReturn } from '../log/logger.base';

export const Errors = {
  UNABLE_TO_SHOW_USER(...args: any): Error {
    const message = 'Unable to show user';
    return logErrorAndReturn(message, ...args);
  },
  UNABLE_TO_LIST_USERS(...args: any): Error {
    const message = 'Unable to list users';
    return logErrorAndReturn(message, ...args);
  },
};
