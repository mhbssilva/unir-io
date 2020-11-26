import { Connection } from "typeorm";
import gcpConfig from "../../config/gcp";
import { DbBaseConnector } from "../base.connector";

// Before: Entities without dependencies
import { Category } from "./entities/category";
import { Institute } from "./entities/institute";
import { Notification } from "./entities/notification";
import { Publication } from "./entities/publication";
import { User } from "./entities/user";

// After: Entities that has dependencies
import { ChatMessage } from "./entities/chat-message";
import { InstituteUser } from "./entities/institute-user";
import { NotificationCategory } from "./entities/notification-category";
import { PublicationAction } from "./entities/publication-action";
import { PublicationCategory } from "./entities/publication-category";
import { PublicationComment } from "./entities/publication-comment";
import { PublicationReport } from "./entities/publication-report";

export class MysqlConnector extends DbBaseConnector {
  public async getConnection(): Promise<Connection> {
    return await super.getConnection({
      name: "default",
      type: "mysql",
      charset: "utf8mb4_unicode_ci",
      port: 3306,
      timezone: "Z",
      synchronize: false,
      logging: true,
      host: gcpConfig.databases.mysql.host,
      username: gcpConfig.databases.mysql.user,
      database: gcpConfig.databases.mysql.db,
      password: gcpConfig.databases.mysql.pass,
      entities: [
        Category,
        Institute,
        ChatMessage,
        Notification,
        Publication,
        User,
        InstituteUser,
        NotificationCategory,
        PublicationAction,
        PublicationCategory,
        PublicationComment,
        PublicationReport,
      ],
    });
  }
}
