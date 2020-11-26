import { MysqlConnector } from '../../db/mysql/connector';
import { Connection } from 'typeorm';

type DbType = 'mysql' | undefined;

export class BaseService {
  private mysqlDb: Promise<Connection>;

  constructor() {
    this.mysqlDb = new MysqlConnector().getConnection();
  }

  public getDb(dbType: DbType = 'mysql'): any {
    switch (dbType) {
      default:
        return this.mysqlDb;
    }
  }
}
