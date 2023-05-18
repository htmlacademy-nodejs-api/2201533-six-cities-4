export const getMongoURI = (username: string, password: string, host: string, port: string, dbName: string): string =>
  `mongodb://${username}:${password}@${host}:${port}/${dbName}?authSource=admin`;
