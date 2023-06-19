import {inject, injectable} from 'inversify';
import {ExceptionFilterInterface} from './exeption-filter.iterface.js';
import {AppComponent} from '../../types/app-component.enum.js';
import {LoggerInterface} from '../logger/logger.interface.js';
import HttpError from '../errors/http-error.js';
import {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {createErrorObject} from '../helpers/common.js';
import {ServiceError} from '../../types/service-error.enum.js';

@injectable()
export default class HttpErrorExceptionFilter implements ExceptionFilterInterface {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface
  ) {
    this.logger.info('Register HttpErrorExceptionFilter');
  }

  public catch(error: unknown, req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof HttpError)) {
      return next(error);
    }

    this.logger.error(`[HttpErrorException]: ${req.path} # ${error.message}`);

    res
      .status(StatusCodes.BAD_REQUEST)
      .json(createErrorObject(ServiceError.CommonError, error.message));
  }
}
