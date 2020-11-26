import { APIGatewayProxyHandler } from 'aws-lambda';
import middy from 'middy';
import { doNotWaitForEmptyEventLoop } from 'middy/middlewares';
import 'source-map-support/register';
import WebScraperService from '../services/external/webscraper';
import { BaseResponse as response } from './base.model';

const updateUnirioNewsHandler: APIGatewayProxyHandler = async (
  _event,
  _context
) => {
  try {
    const webScraperService: WebScraperService = new WebScraperService();
    await webScraperService.updateUnirioGeneralNews();
    await webScraperService.updateUnirioRestaurantNews();
    return response.success();
  } catch (e) {
    return response.error(e);
  }
};

const updateUnirioNews = middy(updateUnirioNewsHandler).use(
  doNotWaitForEmptyEventLoop()
);

export { updateUnirioNews };
