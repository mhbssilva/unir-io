import { logErrorAndReturn } from '../log/logger.base';

export const Errors = {
  UNABLE_TO_ADD_PUBLICATION(...args: any): Error {
    const message = 'Unable to add publication';
    return logErrorAndReturn(message, ...args);
  },
  UNABLE_TO_DELETE_PUBLICATION(...args: any): Error {
    const message = 'Unable to delete publication';
    return logErrorAndReturn(message, ...args);
  },
  UNABLE_TO_ADD_PUBLICATION_WITHOUT_CONTENT_AND_IMAGE(...args: any): Error {
    const message = 'Unable to add publication without content and image';
    return logErrorAndReturn(message, ...args);
  },
  UNABLE_TO_VERIFY_IF_ANONYMITY_LIMIT_HAS_BEEN_EXCEEDED(...args: any): Error {
    const message = 'Unable to verify if anonymity limit has been exceeded';
    return logErrorAndReturn(message, ...args);
  },
  USER_EXCEEDED_ANONYMOUS_PUBLICATIONS_LIMIT(...args: any): Error {
    const message = 'User exceeded anonymous publications limit';
    return logErrorAndReturn(message, ...args);
  },
  UNABLE_TO_SHOW_PUBLICATION(...args: any): Error {
    const message = 'Unable to show publication';
    return logErrorAndReturn(message, ...args);
  },
  UNABLE_TO_LIST_PUBLICATIONS(...args: any): Error {
    const message = 'Unable to list publications';
    return logErrorAndReturn(message, ...args);
  },
  UNABLE_TO_COMMENT_PUBLICATION(...args: any): Error {
    const message = 'Unable to comment publication';
    return logErrorAndReturn(message, ...args);
  },
  UNABLE_TO_ADD_ACTION_TO_PUBLICATION(...args: any): Error {
    const message = 'Unable to add action to publication';
    return logErrorAndReturn(message, ...args);
  },
  UNABLE_TO_ADD_REPORT_TO_PUBLICATION(...args: any): Error {
    const message = 'Unable to add report to publication';
    return logErrorAndReturn(message, ...args);
  }
};
