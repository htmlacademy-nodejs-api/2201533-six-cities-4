import {MiddlewareInterface} from '../../../types/middleware.interface.js';
import {ClassConstructor, plainToInstance} from 'class-transformer';
import {NextFunction, Request, Response} from 'express';
import {validate} from 'class-validator';
import {StatusCodes} from 'http-status-codes';
import fs from 'node:fs';

export class ValidateDtoMiddleware implements MiddlewareInterface {
  constructor(
    private dto: ClassConstructor<object>,
    private isSkipMissing: boolean = false
  ) {}

  public async execute({body}: Request, res: Response, next: NextFunction): Promise<void> {
    // console.log('ValidateDtoMiddleware:', body);
    const dtoInstance = plainToInstance(this.dto, body);
    const errors = await validate(dtoInstance, {skipMissingProperties: this.isSkipMissing});

    if (errors.length > 0) {
      res.status(StatusCodes.BAD_REQUEST).send(errors);
      if (res.locals.files) {
        res.locals.files.forEach((fileName: string) => fs.unlink(fileName, () => console.log));
      }
      return;
    }

    next();
  }
}
