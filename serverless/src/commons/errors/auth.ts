import { logErrorAndReturn } from '../log/logger.base';

export const Errors = {
  UNABLE_TO_LOGIN(...args: any): Error {
    const message = 'Unable to login';
    return logErrorAndReturn(message, ...args);
  },
  UNABLE_TO_LOGOUT(...args: any): Error {
    const message = 'Unable to logout';
    return logErrorAndReturn(message, ...args);
  },
  UNABLE_TO_DECRYPT_USER_TOKEN(...args: any): Error {
    const message = 'Unable to decrypt user token';
    return logErrorAndReturn(message, ...args);
  },
  USER_NOT_FOUND_IN_FIREBASE(...args: any): Error {
    const message = 'User not found in firebase';
    return logErrorAndReturn(message, ...args);
  },
  USER_NOT_FOUND(...args: any): Error {
    const message = 'User not found';
    return logErrorAndReturn(message, ...args);
  },
  INVALID_TOKEN(...args: any): Error {
    const message = 'Invalid token';
    return logErrorAndReturn(message, ...args);
  }
};
