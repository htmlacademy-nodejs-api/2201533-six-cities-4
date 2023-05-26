import {LoggerInterface} from '../core/logger/logger.interface.js';
import {ConfigInterface} from '../core/config/config.interface.js';
import {RestSchema} from '../core/config/rest.schema.js';
import {inject, injectable} from 'inversify';
import {AppComponent} from '../types/app-component.enum.js';
import {DatabaseClientInterface} from '../core/database-client/database-client.interface.js';
import {getMongoURI} from '../core/helpers/mongo-conection-string.js';
import {fillCities} from '../core/helpers/fill-cities.js';

@injectable()
export default class RestApplication {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.ConfigInterface) private readonly config: ConfigInterface<RestSchema>,
    @inject(AppComponent.DatabaseInterface) private readonly databaseClient: DatabaseClientInterface
  ) {}

  private async _initDb() {
    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
      this.config.get('RETRY_TIMEOUT'),
      this.config.get('RETRY_COUNT')
    );

    return this.databaseClient.connect(mongoUri);
  }

  public async init() {
    this.logger.info('Application initialization...');
    this.config.getAll().forEach(([name, value]) =>
      this.logger.info(`Get value from env $${name}: ${value}`));
    this.logger.info('Init database…');
    await this._initDb();
    this.logger.info('Init database completed');
    await fillCities();
    this.logger.info('Cities added to base');
  }
}
