import { APIGatewayProxyHandler } from 'aws-lambda';
import middy from 'middy';
import { doNotWaitForEmptyEventLoop } from 'middy/middlewares';
import 'source-map-support/register';
import { User } from '../db/mysql/entities/user';
import UserService from '../services/core/user';
import { classToObject } from '../utils/object.helper';
import { BaseResponse as response } from './base.model';
import { authenticate } from './middleware/auth';
import { updateLastActivityDate } from './middleware/user';
import { IUserAuthData, IUserLoggedData } from '../services/core/auth.model';
import AuthService from '../services/core/auth';

const loginHandler: APIGatewayProxyHandler = async (event, _context) => {
  try {
    const authUser: IUserAuthData = JSON.parse(event.body);
    const authService: AuthService = new AuthService();
    const loggedUser: IUserLoggedData = await authService.login(authUser);

    return response.success(loggedUser);
  } catch (e) {
    return response.error(e);
  }
};

const showHandler: APIGatewayProxyHandler = async (event: any, _context) => {
  try {
    const userService = new UserService();
    const user: User = await userService.show(event.pathParameters);

    return response.success(classToObject(user));
  } catch (e) {
    return response.error(e);
  }
};

const listHandler: APIGatewayProxyHandler = async (event: any, _context) => {
  try {
    const options = {
      ...event.queryStringParameters,
      idsIn: event.queryStringParameters.idsIn
        ? event.queryStringParameters.idsIn.split(',')
        : null
    };
    const userService = new UserService();
    const users: Array<User> = await userService.list(options);

    return response.success(classToObject(users));
  } catch (e) {
    return response.error(e);
  }
};

const list = middy(listHandler)
  .use(authenticate())
  .use(updateLastActivityDate())
  .use(doNotWaitForEmptyEventLoop());

const login = middy(loginHandler).use(doNotWaitForEmptyEventLoop());

const show = middy(showHandler)
  .use(authenticate())
  .use(updateLastActivityDate())
  .use(doNotWaitForEmptyEventLoop());

export { list, login, show };
