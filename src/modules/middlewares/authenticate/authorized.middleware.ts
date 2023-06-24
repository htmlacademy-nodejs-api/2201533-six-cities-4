import {MiddlewareInterface} from '../../../types/middleware.interface.js';
import {NextFunction, Request, Response} from 'express';
import HttpError from '../../../core/errors/http-error.js';
import {StatusCodes} from 'http-status-codes';

export class AuthorizedMiddleware implements MiddlewareInterface {
  public async execute(_req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log('AuthorizedMiddleware');
    if (res.locals.user) {
      return next();
    }
    return next(new HttpError(
      StatusCodes.UNAUTHORIZED,
      'Unauthorized',
      'AuthenticateMiddleware')
    );
  }
}
