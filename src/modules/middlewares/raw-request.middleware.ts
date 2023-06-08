import {MiddlewareInterface} from '../../types/middleware.interface';
import express, {NextFunction, Request, Response} from 'express';

export class RawRequestMiddleware implements MiddlewareInterface {

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const raw = express.raw({limit: 100000000, type: 'multipart/form-data'});
    raw(req, _res, next);
  }
}
