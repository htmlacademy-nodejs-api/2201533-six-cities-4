import {MiddlewareInterface} from '../../types/middleware.interface.js';
import {NextFunction, Request, Response} from 'express';
import {ClassConstructor, plainToInstance} from 'class-transformer';

export class TrimLikeRdoMiddleware implements MiddlewareInterface {
  constructor(
    private readonly rdo: ClassConstructor<object>,
  ) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const dtoInstance = plainToInstance(this.rdo, req.body, { excludeExtraneousValues: true });
    req.body = Object.fromEntries(Object.entries(dtoInstance).filter(([_, v]) => v !== undefined));
    return next();

  }
}
