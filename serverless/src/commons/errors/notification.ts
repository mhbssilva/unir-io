import { logErrorAndReturn } from '../log/logger.base';

export const Errors = {
  UNABLE_TO_LIST_NOTIFICATIONS(...args: any): Error {
    const message = 'Unable to list notifications';
    return logErrorAndReturn(message, ...args);
  }
};
