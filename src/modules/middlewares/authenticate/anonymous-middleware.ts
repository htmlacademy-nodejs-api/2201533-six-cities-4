import {MiddlewareInterface} from '../../../types/middleware.interface.js';
import {NextFunction, Request, Response} from 'express';
import {ejectUser} from './eject-user.js';
import HttpError from '../../../core/errors/http-error.js';
import {StatusCodes} from 'http-status-codes';
import {UserServiceInterface} from '../../user/user-service.interface.js';

export class AnonymousMiddleware implements MiddlewareInterface {
  constructor(private readonly jwtSecret: string, private readonly userService: UserServiceInterface) {}

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const user = await ejectUser(req, this.jwtSecret, this.userService);
    if (user) {
      res.locals.user = user;
      return next();
    }
    return next(new HttpError(
      StatusCodes.CONFLICT,
      'Not anonymous',
      'AnonymousMiddleware')
    );
  }
}
