import {MiddlewareInterface} from '../../types/middleware.interface';
import {NextFunction, Request, Response} from 'express';

export class ShowRaw implements MiddlewareInterface {

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    console.log(req.headers['content-type']);
    console.log(req.body.buffer);
    return next();
  }
}
