import {DatabaseClientInterface} from './database-client.interface.js';
import {inject, injectable} from 'inversify';
import mongoose, {Mongoose} from 'mongoose';
import {LoggerInterface} from '../logger/logger.interface.js';
import {AppComponent} from '../../types/app-component.enum.js';
import {setTimeout} from 'node:timers/promises';
import {ConnectionType} from '../../types/connection.type.js';

@injectable()
export default class MongoClientService implements DatabaseClientInterface {
  private isConnected = false;
  private mongooseInstance: Mongoose | null = null;

  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface
  ) {}

  private async connectWithRetry({uri, timeout, count}: ConnectionType): Promise<Mongoose> {
    let attempt = 0;
    while (attempt < count) {
      try {
        return await mongoose.connect(uri);
      } catch (error) {
        attempt++;
        this.logger.error(`Failed to connect to the database. Attempt ${attempt}`);
        await setTimeout(timeout);
      }
    }

    this.logger.error(`Unable to establish database connection after ${attempt} attempts`);
    throw new Error('Failed to connect to the database');
  }

  private async connectPrivate(uri:ConnectionType): Promise<void> {
    this.mongooseInstance = await this.connectWithRetry(uri);
    this.isConnected = true;
  }

  private async disconnectPrivate(): Promise<void> {
    await this.mongooseInstance?.disconnect();
    this.isConnected = false;
    this.mongooseInstance = null;
  }

  public async connect(uri: ConnectionType): Promise<void> {
    if (this.isConnected) {
      throw new Error('MongoDB client already connected');
    }

    this.logger.info('Trying to connect to MongoDB…');
    await this.connectPrivate(uri);
    this.logger.info('Database connection established.');
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Not connected to the database');
    }

    await this.disconnectPrivate();
    this.logger.info('Database connection closed.');
  }
}
