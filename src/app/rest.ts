import cors from 'cors';
import {LoggerInterface} from '../core/logger/logger.interface.js';
import {ConfigInterface} from '../core/config/config.interface.js';
import {RestSchema} from '../core/config/rest.schema.js';
import {inject, injectable} from 'inversify';
import {AppComponent} from '../types/app-component.enum.js';
import {DatabaseClientInterface} from '../core/database-client/database-client.interface.js';
import {getMongoURI} from '../core/helpers/mongo-conection-string.js';
import {fillCities} from '../core/helpers/fill-cities.js';
import express, {Express} from 'express';
import {ControllerInterface} from '../core/controller/controller-interface.js';
import {ExceptionFilterInterface} from '../core/exeption-filters/exeption-filter.iterface.js';
import {AuthenticateMiddleware} from '../modules/middlewares/authenticate/authenticate.middleware.js';
import {UserServiceInterface} from '../modules/user/user-service.interface.js';
import {getFullServerPath} from '../core/helpers/common.js';

@injectable()
export default class RestApplication {
  private expressApplication: Express;
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.ConfigInterface) private readonly config: ConfigInterface<RestSchema>,
    @inject(AppComponent.DatabaseInterface) private readonly databaseClient: DatabaseClientInterface,
    @inject(AppComponent.OfferController) private readonly offerController: ControllerInterface,
    @inject(AppComponent.FavoritesController) private readonly favoritesController: ControllerInterface,
    @inject(AppComponent.CityController) private readonly cityController: ControllerInterface,
    @inject(AppComponent.UserController) private readonly userController: ControllerInterface,
    @inject(AppComponent.CommentController) private readonly commentController: ControllerInterface,
    @inject(AppComponent.HttpErrorExceptionFilter) private readonly httpErrorExceptionFilter: ExceptionFilterInterface,
    @inject(AppComponent.BaseExceptionFilter) private readonly baseExceptionFilter: ExceptionFilterInterface,
    @inject(AppComponent.ValidationExceptionFilter) private readonly validationExceptionFilter: ExceptionFilterInterface,
    @inject(AppComponent.UserServiceInterface) private readonly userService: UserServiceInterface
  ) {
    this.expressApplication = express();
  }

  private async initDb() {
    this.logger.info('Init database');

    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
      this.config.get('RETRY_TIMEOUT'),
      this.config.get('RETRY_COUNT')
    );

    await this.databaseClient.connect(mongoUri);
    this.logger.info('Init database completed');
  }

  private async initServer() {
    this.logger.info('Try to init server...');

    const port = this.config.get('PORT');
    this.expressApplication.listen(port);

    this.logger.info(`🚀Server started on ${getFullServerPath(this.config.get('HOST'), this.config.get('PORT'))}`);
  }

  private async initMiddleware() {
    this.logger.info('Global middleware initialization...');
    this.expressApplication.use(express.json());
    this.expressApplication.use('/upload', express.static(this.config.get('UPLOAD_DIRECTORY')));
    this.expressApplication.use('/static', express.static(this.config.get('STATIC_DIRECTORY_PATH'))
    );
    const authenticateMiddleware =
      new AuthenticateMiddleware(this.config.get('JWT_SECRET'), this.userService);
    this.expressApplication.use(authenticateMiddleware.execute.bind(authenticateMiddleware));
    this.expressApplication.use(cors());
    this.logger.info('Global middleware initialization completed');
  }

  private async initRoutes() {
    this.logger.info('Controller initialization ...');
    this.expressApplication.use('/offers', this.offerController.router);
    this.expressApplication.use('/favorites', this.favoritesController.router);
    this.expressApplication.use('/users', this.userController.router);
    this.expressApplication.use('/', this.cityController.router);
    this.expressApplication.use('/comments', this.commentController.router);
    this.logger.info('Controller initialization completed');
  }

  private async initExceptionFilters() {
    this.logger.info('Exception filters initialization');
    this.expressApplication.use(this.validationExceptionFilter.catch.bind(this.validationExceptionFilter));
    this.expressApplication.use(this.httpErrorExceptionFilter.catch.bind(this.httpErrorExceptionFilter));
    this.expressApplication.use(this.baseExceptionFilter.catch.bind(this.baseExceptionFilter));
    this.logger.info('Exception filters completed');
  }

  public async init() {
    this.logger.info('Application initialization...');
    this.config.getAll().forEach(([name, value]) =>
      this.logger.info(`Get value from env $${name}: ${value}`));
    await this.initDb();
    await fillCities();
    this.logger.info('Cities added to base');
    await this.initMiddleware();
    await this.initRoutes();
    await this.initExceptionFilters();
    await this.initServer();
  }
}
