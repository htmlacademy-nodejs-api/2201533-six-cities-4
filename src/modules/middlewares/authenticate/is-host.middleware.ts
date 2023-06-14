import {MiddlewareInterface} from '../../../types/middleware.interface.js';
import {NextFunction, Request, Response} from 'express';
import HttpError from '../../../core/errors/http-error.js';
import {StatusCodes} from 'http-status-codes';
import {OfferServiceInterface} from '../../offer/offer-service.interface.js';

export class IsHostMiddleware implements MiddlewareInterface {
  constructor(
    private readonly offerService: OfferServiceInterface,
  ) {}

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId = res.locals.user.id;
    const offerId = req.params.offerId as string;
    if (await this.offerService.checkUserIsHost(userId, offerId)) {
      return next();
    }
    return next(new HttpError(
      StatusCodes.CONFLICT,
      'User is not the host of the offer',
      'OfferController',
    ));
  }
}
