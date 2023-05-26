import {ConnectionType} from '../../types/connection.type.js';

export const getMongoURI = (
  username: string,
  password: string,
  host: string,
  port: string,
  dbName: string,
  timeout: number,
  count: number
): ConnectionType => ({
  uri: `mongodb://${username}:${password}@${host}:${port}/${dbName}?authSource=admin`,
  timeout: timeout,
  count: count
});
