import {MiddlewareInterface} from '../../../types/middleware.interface.js';
import {ClassConstructor, plainToInstance} from 'class-transformer';
import {NextFunction, Request, Response} from 'express';
import {validate} from 'class-validator';
import ValidationError from '../../../core/errors/validation-error.js';
import {transformErrors} from '../../../core/helpers/common.js';

export class ValidateDtoMiddleware implements MiddlewareInterface {
  constructor(
    private dto: ClassConstructor<object>,
    private isSkipMissing: boolean = false
  ) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const { body } = req;
    console.log('ValidateDtoMiddleware', body);
    const dtoInstance = plainToInstance(this.dto, body);
    const errors = await validate(dtoInstance, {skipMissingProperties: this.isSkipMissing});

    if (errors.length > 0) {
      throw new ValidationError(`Validation error: "${req.path}"`, transformErrors(errors));
    }

    next();
  }
}
