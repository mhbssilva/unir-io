import axios from "axios";
import cheerio from "cheerio";
import moment from "moment";
import { Connection, MoreThanOrEqual } from "typeorm";
import { Errors as WebscraperErrors } from "../../commons/errors/webscraper";
import webscraperConfig from "../../config/webscraper";
import { Notification } from "../../db/mysql/entities/notification";
import { NotificationCategory } from "../../db/mysql/entities/notification-category";
import { BaseService } from "../core/base";
import { IUnirioNews } from "./webscraper.model";

type WebscraperUpdateUnirioGeneralNews = () => Promise<Notification[]>;
type WebscraperUpdateUnirioRestaurantNews = () => Promise<Notification[]>;
type WebscraperGetUnirioGeneralNewsPageContent = (
  offset?: number
) => Promise<string>;
type WebscraperGetUnirioRestaurantNewsPageContent = () => Promise<string>;
type WebscraperGetUnirioGeneralNewsListFromPageContent = (
  htmlContent: string
) => Array<IUnirioNews>;
type WebscraperGetUnirioRestaurantNewsListFromPageContent = (
  htmlContent: string
) => Array<IUnirioNews>;
type WebscraperUnirioInsertOrUpdateNotifications = (
  newsList: Array<IUnirioNews>,
  categoryId: number
) => Promise<Notification[]>;

class WebScraperService extends BaseService {
  /**
   * Gets news from the Unirio web site
   * and saves on database.
   */
  updateUnirioGeneralNews: WebscraperUpdateUnirioGeneralNews = async () => {
    let newsList: Array<IUnirioNews> = new Array<IUnirioNews>();

    try {
      for (
        var execution = 0;
        execution < webscraperConfig.unirio.news.loopExecutions;
        execution++
      ) {
        const loopOffset = webscraperConfig.unirio.news.loopOffset * execution;
        const newsPageContent = await this.getUnirioNewsPageContent(loopOffset);

        newsList = newsList.concat(
          this.getUnirioGeneralNewsListFromPageContent(newsPageContent)
        );
      }

      if (!newsList || !newsList.length) {
        throw new Error();
      }
    } catch (e) {
      throw WebscraperErrors.COULD_NOT_GET_GENERAL_NEWS_FROM_UNIRIO(e);
    }

    try {
      return await this.insertOrUpdateNotifications(newsList, 1);
    } catch (e) {
      throw WebscraperErrors.COULD_NOT_SAVE_GENERAL_NEWS_OBTAINED_FROM_UNIRIO(
        e
      );
    }
  };

  /**
   * Gets restaurant news from the Unirio
   * web site and saves on database.
   */
  updateUnirioRestaurantNews: WebscraperUpdateUnirioRestaurantNews = async () => {
    let newsList: Array<IUnirioNews> = new Array<IUnirioNews>();

    try {
      const newsPageContent = await this.getUnirioRestaurantPageContent();

      newsList = newsList.concat(
        this.getUnirioRestaurantNewsListFromPageContent(newsPageContent)
      );

      if (!newsList || !newsList.length) {
        throw new Error();
      }
    } catch (e) {
      throw WebscraperErrors.COULD_NOT_GET_RESTAURANT_NEWS_FROM_UNIRIO(e);
    }

    try {
      return await this.insertOrUpdateNotifications(newsList, 5);
    } catch (e) {
      throw WebscraperErrors.COULD_NOT_SAVE_RESTAURANT_NEWS_OBTAINED_FROM_UNIRIO(
        e
      );
    }
  };

  /**
   * Gets the text/html content
   * of the UNIRIO news page and
   * returns it.
   */
  private getUnirioNewsPageContent: WebscraperGetUnirioGeneralNewsPageContent = async (
    offset: number
  ) => {
    const response: any = await axios({
      url: `http://www.unirio.br/news/?b_start:int=${offset}`,
      method: `get`,
      timeout: 15 * 1000,
    });
    return response.data;
  };

  /**
   * Gets the text/html content
   * of the UNIRIO news page and
   * returns it.
   */
  private getUnirioRestaurantPageContent: WebscraperGetUnirioRestaurantNewsPageContent = async () => {
    const response: any = await axios({
      url: `http://www.unirio.br/prae/nutricao-prae-1/cardapios-anteriores-re/cardapios-restaurante-escola-2019`,
      method: `get`,
      timeout: 15 * 1000,
    });
    return response.data;
  };

  /**
   * Gets a list of news objects from
   * the text/html content of a page.
   */
  private getUnirioGeneralNewsListFromPageContent: WebscraperGetUnirioGeneralNewsListFromPageContent = (
    htmlContent: string
  ) => {
    let newsList: Array<IUnirioNews> = new Array<IUnirioNews>();
    const $ = cheerio.load(htmlContent, {
      normalizeWhitespace: true,
      xmlMode: true,
    });

    $(`div#content article`).each((_index: number, dataNode: any) => {
      newsList.push({
        title: $(dataNode).find("h2.tileHeadline a").text(),
        description: $(dataNode).find("p.tileBody span.description").text(),
        contentUrl: $(dataNode).find("h2.tileHeadline a").attr("href"),
        imageUrl: $(dataNode).find("div.tileImage a img").attr("src"),
      });
    });

    return newsList;
  };

  /**
   * Gets a list of restaurant news objects from
   * the text/html content of a page.
   */
  private getUnirioRestaurantNewsListFromPageContent: WebscraperGetUnirioRestaurantNewsListFromPageContent = (
    htmlContent: string
  ) => {
    let newsList: Array<IUnirioNews> = new Array<IUnirioNews>();
    const $ = cheerio.load(htmlContent, {
      normalizeWhitespace: true,
      xmlMode: true,
    });

    $(`div#content p a`).each((_index: number, dataNode: any) => {
      newsList.push({
        title: $(dataNode).text(),
        contentUrl: $(dataNode).attr("href"),
      });
    });

    return newsList;
  };

  /**
   * Inserts a news list in the
   * notifications table.
   */
  private insertOrUpdateNotifications: WebscraperUnirioInsertOrUpdateNotifications = async (
    newsList: Array<IUnirioNews>,
    categoryId: number
  ) => {
    const db: Connection = await this.getDb();

    const dbNewsListUpdatePromise: Promise<Notification>[] = newsList.map(
      async (news) => {
        let dbNotification: Notification = await db
          .getRepository(Notification)
          .findOne({
            contentUrl: news.contentUrl,
            createdAt: MoreThanOrEqual(moment().subtract(3, "days").toDate()),
          });

        if (!dbNotification) {
          dbNotification = new Notification();
          dbNotification.createdAt = moment().toDate();
        }

        dbNotification.instituteId = webscraperConfig.unirio.instituteId;
        dbNotification.title = news.title;
        dbNotification.description = news.description;
        dbNotification.contentUrl = news.contentUrl;
        dbNotification.imageUrl = news.imageUrl;
        dbNotification.updatedAt = moment().toDate();
        dbNotification = await dbNotification.save();

        let dbNotificationCategory: NotificationCategory = await db
          .getRepository(NotificationCategory)
          .findOne({
            where: {
              notificationId: dbNotification.id,
              categoryId: categoryId,
            },
          });

        if (!dbNotificationCategory) {
          dbNotificationCategory = new NotificationCategory();
          dbNotificationCategory.createdAt = moment().toDate();
        }

        dbNotificationCategory.notificationId = dbNotification.id;
        dbNotificationCategory.categoryId = categoryId;
        dbNotificationCategory.updatedAt = moment().toDate();
        await dbNotificationCategory.save();

        return dbNotification;
      }
    );

    return await Promise.all(dbNewsListUpdatePromise);
  };
}

export default WebScraperService;
