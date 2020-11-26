import { APIGatewayProxyHandler } from 'aws-lambda';
import middy from 'middy';
import { doNotWaitForEmptyEventLoop } from 'middy/middlewares';
import 'source-map-support/register';
import { BaseResponse as response } from './base.model';
import { authenticate } from './middleware/auth';
import { updateLastActivityDate } from './middleware/user';
import {
  IPublicationAddOptions,
  IPublicationIsAnonymityLimitExceededOptions,
  IPublicationAddActionOptions,
  IPublicationDeleteOptions,
  IPublicationAddCommentOptions,
  IPublicationAddReportOptions
} from '../services/core/publication.model';
import PublicationService from '../services/core/publication';
import { Publication } from '../db/mysql/entities/publication';
import { classToObject } from '../utils/object.helper';

const showHandler: APIGatewayProxyHandler = async (event: any, _context) => {
  try {
    const publicationService = new PublicationService();
    const publications: Array<Publication> = await publicationService.show(
      event.pathParameters
    );

    return response.success(classToObject(publications));
  } catch (e) {
    return response.error(e);
  }
};

const listHandler: APIGatewayProxyHandler = async (event: any, _context) => {
  try {
    const options = {
      ...event.queryStringParameters,
      categories:
        event.queryStringParameters && event.queryStringParameters.categories
          ? event.queryStringParameters.categories.split(',')
          : null
    };

    const publicationService = new PublicationService();
    const publications: Array<Publication> = await publicationService.list(
      options
    );

    return response.success(classToObject(publications));
  } catch (e) {
    return response.error(e);
  }
};

const addHandler: APIGatewayProxyHandler = async (event: any, _context) => {
  try {
    const options: IPublicationAddOptions = {
      ...JSON.parse(event.body),
      user: event.authUser
    };

    const publicationService = new PublicationService();
    const publication: Publication = await publicationService.add(options);

    return response.success(classToObject(publication));
  } catch (e) {
    return response.error(e);
  }
};

const deleteHandler: APIGatewayProxyHandler = async (event: any, _context) => {
  try {
    const options: IPublicationDeleteOptions = {
      ...event.pathParameters,
      user: event.authUser
    };

    const publicationService = new PublicationService();
    const publication: Publication = await publicationService.delete(options);

    return response.success(classToObject(publication));
  } catch (e) {
    return response.error(e);
  }
};

const addCommentHandler: APIGatewayProxyHandler = async (
  event: any,
  _context
) => {
  try {
    const options: IPublicationAddCommentOptions = {
      ...JSON.parse(event.body),
      ...event.pathParameters,
      user: event.authUser
    };

    const publicationService = new PublicationService();
    const publication: Publication = await publicationService.addComment(
      options
    );

    return response.success(classToObject(publication));
  } catch (e) {
    return response.error(e);
  }
};

const addActionHandler: APIGatewayProxyHandler = async (
  event: any,
  _context
) => {
  try {
    const options: IPublicationAddActionOptions = {
      ...JSON.parse(event.body),
      ...event.pathParameters,
      user: event.authUser
    };

    const publicationService = new PublicationService();
    const publication: Publication = await publicationService.addAction(
      options
    );

    return response.success(classToObject(publication));
  } catch (e) {
    return response.error(e);
  }
};

const addReportHandler: APIGatewayProxyHandler = async (
  event: any,
  _context
) => {
  try {
    const options: IPublicationAddReportOptions = {
      ...JSON.parse(event.body),
      ...event.pathParameters,
      user: event.authUser
    };

    const publicationService = new PublicationService();
    const publication: Publication = await publicationService.addReport(
      options
    );

    return response.success(classToObject(publication));
  } catch (e) {
    return response.error(e);
  }
};

const isAnonymityLimitExceededHandler: APIGatewayProxyHandler = async (
  event: any,
  _context
) => {
  try {
    const options: IPublicationIsAnonymityLimitExceededOptions = {
      user: event.authUser
    };

    const publicationService = new PublicationService();
    const isAnonymityLimitExceeded: boolean = await publicationService.isAnonymityLimitExceeded(
      options
    );

    return response.success({ exceeded: isAnonymityLimitExceeded });
  } catch (e) {
    return response.error(e);
  }
};

const show = middy(showHandler)
  .use(authenticate())
  .use(updateLastActivityDate())
  .use(doNotWaitForEmptyEventLoop());

const list = middy(listHandler)
  .use(authenticate())
  .use(updateLastActivityDate())
  .use(doNotWaitForEmptyEventLoop());

const add = middy(addHandler)
  .use(authenticate())
  .use(updateLastActivityDate())
  .use(doNotWaitForEmptyEventLoop());

const remove = middy(deleteHandler)
  .use(authenticate())
  .use(updateLastActivityDate())
  .use(doNotWaitForEmptyEventLoop());

const addComment = middy(addCommentHandler)
  .use(authenticate())
  .use(updateLastActivityDate())
  .use(doNotWaitForEmptyEventLoop());

const addAction = middy(addActionHandler)
  .use(authenticate())
  .use(updateLastActivityDate())
  .use(doNotWaitForEmptyEventLoop());

const addReport = middy(addReportHandler)
  .use(authenticate())
  .use(updateLastActivityDate())
  .use(doNotWaitForEmptyEventLoop());

const isAnonymityLimitExceeded = middy(isAnonymityLimitExceededHandler)
  .use(authenticate())
  .use(updateLastActivityDate())
  .use(doNotWaitForEmptyEventLoop());

export {
  add,
  remove,
  addComment,
  addAction,
  addReport,
  list,
  show,
  isAnonymityLimitExceeded
};
