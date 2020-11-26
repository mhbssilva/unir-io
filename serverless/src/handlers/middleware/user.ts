import 'source-map-support/register';
import { BaseResponse as response } from '../base.model';
import { User } from '../../db/mysql/entities/user';
import moment from 'moment';

const updateLastActivityDate = () => {
  return {
    before: async handler => {
      try {
        let user: User = handler.event.authUser;
        user.lastLoginAt = moment().toDate();
        await user.save();
      } catch (error) {
        throw error;
      }
      return;
    },
    onError: async handler => {
      handler.response = response.error(handler.error);
      return Promise.resolve();
    }
  };
};

export { updateLastActivityDate };
