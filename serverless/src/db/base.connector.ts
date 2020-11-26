import {
  Connection,
  ConnectionOptions,
  ConnectionManager,
  getConnectionManager,
  createConnection
} from 'typeorm';

export class DbBaseConnector {
  private connectionManager: ConnectionManager;

  constructor() {
    this.connectionManager = getConnectionManager();
  }

  public async getConnection(
    connectionOptions?: ConnectionOptions
  ): Promise<Connection> {
    let connection: Connection;
    let connectionName = connectionOptions.name;

    if (this.connectionManager.has(connectionName)) {
      connection = await this.connectionManager.get(connectionName);
      if (!connection.isConnected) {
        connection = await connection.connect();
      }
    } else {
      connection = await createConnection(connectionOptions);
    }
    return connection;
  }
}
