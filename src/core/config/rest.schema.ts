import convict from 'convict';
import validator from 'convict-format-with-validator';

export type RestSchema = {
  PORT: number;
  DB_HOST: string;
  SALT: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_PORT: string;
  DB_NAME: string;
  RETRY_COUNT: number;
  RETRY_TIMEOUT: number;
  RESPONSE_OFFER_LIMIT: number;
  UPLOAD_DIRECTORY: string;
  JWT_SECRET: string;
  HOST: string;
  STATIC_DIRECTORY_PATH: string;
}

convict.addFormats(validator);

export const configRestSchema = convict<RestSchema>({
  PORT: {
    doc: 'Port for incoming connections',
    format: 'port',
    env: 'PORT',
    default: 4000
  },
  DB_HOST: {
    doc: 'IP address to connect to the database',
    format: 'ipaddress',
    env: 'DB_HOST',
    default: '127.0.0.1'
  },
  SALT: {
    doc: 'Cryptographic salt',
    format: String,
    env: 'SALT',
    default: null
  },
  DB_USER: {
    doc: 'Username to connect to the database',
    format: String,
    env: 'DB_USER',
    default: null
  },
  DB_PASSWORD: {
    doc: 'Password to connect to the database',
    format: String,
    env: 'DB_PASSWORD',
    default: null
  },
  DB_PORT: {
    doc: 'Port to connect to the database',
    format: String,
    env: 'DB_PORT',
    default: '27017'
  },
  DB_NAME: {
    doc: 'Database name (MongoDB)',
    format: String,
    env: 'DB_NAME',
    default: 'six-cities-mongo'
  },
  RETRY_COUNT: {
    doc: 'Number of attempts to connect to the database',
    format: Number,
    env: 'DB_CONNECT_RETRY_COUNT',
    default: 5
  },
  RETRY_TIMEOUT: {
    doc: ' Interval between retries to connect to the database',
    format: Number,
    env: 'DB_CONNECT_RETRY_TIMEOUT',
    default: 1000
  },
  RESPONSE_OFFER_LIMIT: {
    doc: 'Maximum number of offers in the response',
    format: Number,
    env: 'RESPONSE_OFFER_LIMIT',
    default: 60
  },
  UPLOAD_DIRECTORY: {
    doc: 'Directory for upload files',
    format: String,
    env: 'UPLOAD_DIRECTORY',
    default: null
  },
  JWT_SECRET: {
    doc: 'Secret for sign JWT',
    format: String,
    env: 'JWT_SECRET',
    default: null
  },
  HOST: {
    doc: 'Host where started service',
    format: String,
    env: 'HOST',
    default: 'localhost'
  },
  STATIC_DIRECTORY_PATH: {
    doc: 'Path to directory with static resources',
    format: String,
    env: 'STATIC_DIRECTORY_PATH',
    default: 'static'
  },
});
