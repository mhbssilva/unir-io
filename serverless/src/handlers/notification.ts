import { APIGatewayProxyHandler } from 'aws-lambda';
import middy from 'middy';
import { doNotWaitForEmptyEventLoop } from 'middy/middlewares';
import 'source-map-support/register';
import { Notification } from '../db/mysql/entities/notification';
import NotificationService from '../services/core/notification';
import { classToObject } from '../utils/object.helper';
import { BaseResponse as response } from './base.model';
import { authenticate } from './middleware/auth';
import { updateLastActivityDate } from './middleware/user';

const listHandler: APIGatewayProxyHandler = async (event: any, _context) => {
  try {
    const options = event.queryStringParameters;
    const notificationService = new NotificationService();
    const notifications: Array<Notification> = await notificationService.list(
      options
    );

    return response.success(classToObject(notifications));
  } catch (e) {
    return response.error(e);
  }
};

const list = middy(listHandler)
  .use(authenticate())
  .use(updateLastActivityDate())
  .use(doNotWaitForEmptyEventLoop());

export { list };
