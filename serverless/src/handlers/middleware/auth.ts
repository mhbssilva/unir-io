import 'source-map-support/register';
import AuthService from '../../services/core/auth';
import { BaseResponse as response } from '../base.model';

const authenticate = () => {
  return {
    before: async handler => {
      let authorization: string = handler.event.headers.Authorization;

      try {
        const token = authorization.split(' ', 2).pop();
        const authService: AuthService = new AuthService();

        handler.event.authUser = await authService.getUserFromToken(token);
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

export { authenticate };
