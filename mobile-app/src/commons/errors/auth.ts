import { logErrorAndReturn } from '../log/logger.base';

export const Errors = {
  UNABLE_TO_LOGIN_TO_API(...args: any): Error {
    const message = 'Unable to login to API';
    return logErrorAndReturn(message, ...args);
  },
};
