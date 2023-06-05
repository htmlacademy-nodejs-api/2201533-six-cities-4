import {NextFunction, Request, Response} from 'express';
import {MiddlewareInterface} from '../../../types/middleware.interface.js';
import {Types} from 'mongoose';
import HttpError from '../../../core/errors/http-error.js';
import {StatusCodes} from 'http-status-codes';

export class ObjectIdValidator implements MiddlewareInterface {
  constructor(private param: string) {}

  public execute({params}: Request, _res: Response, next: NextFunction): void {
    const objectId = params[this.param];

    if (Types.ObjectId.isValid(objectId)) {
      return next();
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `${objectId} is invalid ObjectID`,
      'ValidateObjectIdMiddleware'
    );
  }
}
