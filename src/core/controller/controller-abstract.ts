import {injectable} from 'inversify';
import {Router, Response} from 'express';
import asyncHandler from 'express-async-handler';
import {LoggerInterface} from '../logger/logger.interface.js';
import {RouteInterface} from '../../types/route.interface.js';
import {StatusCodes} from 'http-status-codes';
import {ControllerInterface} from './controller-interface.js';
import {ConfigInterface} from '../config/config.interface.js';
import {RestSchema} from '../config/rest.schema.js';
import {UnknownRecord} from '../../types/unknown-record.type.js';
import {getFullServerPath, transformObject} from '../helpers/common.js';
import {STATIC_RESOURCE_FIELDS} from '../../app/consts.js';

@injectable()
export abstract class Controller implements ControllerInterface {
  private readonly routerProp: Router;

  constructor(
    protected readonly logger: LoggerInterface,
    protected readonly configService: ConfigInterface<RestSchema>,
  ) {
    this.routerProp = Router();
  }

  get router() {
    return this.routerProp;
  }

  public addRoute(route: RouteInterface) {
    const routeHandler = asyncHandler(route.handler.bind(this));
    const middlewares = route.middlewares?.map(
      (middleware) => asyncHandler(middleware.execute.bind(middleware))
    );

    const allHandlers = middlewares ? [...middlewares, routeHandler] : routeHandler;
    this.routerProp[route.method](route.path, allHandlers);
    this.logger.info(`Route registered: ${route.method.toUpperCase()} ${route.path}`);
  }

  protected addStaticPath(data: UnknownRecord): void {
    const fullServerPath = getFullServerPath(this.configService.get('HOST'), this.configService.get('PORT'));
    transformObject(
      STATIC_RESOURCE_FIELDS,
      `${fullServerPath}/${this.configService.get('STATIC_DIRECTORY_PATH')}`,
      `${fullServerPath}/${this.configService.get('UPLOAD_DIRECTORY')}`,
      data
    );
  }

  public send<T>(res: Response, statusCode: number, data: T): void {
    this.addStaticPath(data as UnknownRecord);
    res
      .type('application/json')
      .status(statusCode)
      .json(data);
  }

  public created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  public noContent<T>(res: Response, _: T): void {
    this.send(res, StatusCodes.NO_CONTENT, '{}');
  }

  public ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }

  public notFound(res: Response, msg: string): void {
    this.send(res, StatusCodes.NOT_FOUND, {error: msg});
  }
}
