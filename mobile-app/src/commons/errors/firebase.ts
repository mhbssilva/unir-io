import { logErrorAndReturn } from '../log/logger.base';

export const Errors = {
  COULD_NOT_LOGIN_TO_FACEBOOK(...args: any): Error {
    const message = 'Could not login to Facebook';
    return logErrorAndReturn(message, ...args);
  },
  COULD_NOT_LOGIN_TO_GOOGLE(...args: any): Error {
    const message = 'Could not login to Google';
    return logErrorAndReturn(message, ...args);
  },
  COULD_NOT_LOGIN_TO_FIREBASE_USING_CREDENTIALS(...args: any): Error {
    const message = 'Could not login to Firebase using credentials';
    return logErrorAndReturn(message, ...args);
  },
  UNABLE_TO_LOG_OUT_OF_FIREBASE(...args: any): Error {
    const message = 'Unable to log out of Firebase';
    return logErrorAndReturn(message, ...args);
  },
};
