import { logErrorAndReturn } from '../log/logger.base';

export const Errors = {
  USER_NOT_FOUND(...args: any): Error {
    const message = 'User not found';
    return logErrorAndReturn(message, ...args);
  }
};
