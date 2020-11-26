import { logErrorAndReturn } from '../log/logger.base';

export const Errors = {
  UNABLE_TO_UPLOAD_IMAGE(...args: any): Error {
    const message = 'Unable to upload image';
    return logErrorAndReturn(message, ...args);
  }
};
