import { Connection, FindManyOptions, LessThan, MoreThan } from "typeorm";
import { Errors } from "../../commons/errors/notification";
import { Notification } from "../../db/mysql/entities/notification";
import { BaseService } from "./base";
import { INotificationListOptions } from "./notification.model";

type NotificationServiceList = (options?: any) => Promise<Notification[]>;
type NotificationServiceFilterOptions = (
  options?: any
) => FindManyOptions<Notification>;

class NotificationService extends BaseService {
  /**
   * List all noitifications
   * from database.
   */
  list: NotificationServiceList = async (
    options?: INotificationListOptions
  ) => {
    try {
      const filteredOptions = this.filterOptions(options);
      const db: Connection = await this.getDb();
      const notifications: Array<Notification> = await db
        .getRepository(Notification)
        .find({
          ...filteredOptions,
        });

      return notifications;
    } catch (error) {
      throw Errors.UNABLE_TO_LIST_NOTIFICATIONS({ error });
    }
  };

  /**
   * Filter options from handlers
   * and entry points to make it
   * usable on service methods.
   */
  private filterOptions: NotificationServiceFilterOptions = (
    options?: INotificationListOptions
  ) => {
    let filter: FindManyOptions<Notification> = {
      relations: ["categories"],
      where: null,
      order: {
        id: "DESC",
      },
      take: 50,
    };

    if (!options) {
      return filter;
    }

    if (options.relations && options.relations.length) {
      filter.relations = options.relations;
    }

    if (options.idLessThan) {
      filter.where = {
        id: LessThan(options.idLessThan),
      };
    } else if (options.idMoreThan) {
      filter.where = {
        id: MoreThan(options.idMoreThan),
      };
    }

    if (options.take) {
      filter.take = options.take && options.take < 50 ? options.take : 50;
    }

    return filter;
  };
}

export default NotificationService;
