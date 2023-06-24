import {MiddlewareInterface} from '../../types/middleware.interface.js';
import {NextFunction, Request, Response} from 'express';
import {plainToInstance} from 'class-transformer';
import CreateLocationDto from '../location/dto/create-location.dto.js';

export class LocationInstanceMiddleware implements MiddlewareInterface {

  public execute({body}: Request, _res: Response, next: NextFunction): void {
    body.location = plainToInstance(CreateLocationDto, body.location);

    next();
  }
}
