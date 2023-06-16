import {Controller} from '../../core/controller/controller-abstract.js';
import {inject} from 'inversify';
import {AppComponent} from '../../types/app-component.enum.js';
import {LoggerInterface} from '../../core/logger/logger.interface.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {DocumentExistsMiddleware} from '../middlewares/document-exists.middleware.js';
import {AuthorizedMiddleware} from '../middlewares/authenticate/authorized.middleware.js';
import {Request, Response} from 'express';
import {fillDTO} from '../../core/helpers/common.js';
import {FavoritesServiceInterface} from './favorites.service.interface.js';
import {OfferServiceInterface} from '../offer/offer-service.interface.js';
import OfferItemRdo from '../offer/rdo/offer-item.rdo.js';
import {plainToInstance} from 'class-transformer';
import ChangeFavoriteRdo from './rdo/change-favorite.rdo.js';

export default class FavoritesController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface) logger: LoggerInterface,
    @inject(AppComponent.FavoritesServiceInterface) private readonly favoritesService: FavoritesServiceInterface,
    @inject(AppComponent.OfferServiceInterface) private readonly offerService: OfferServiceInterface
  ) {
    super(logger);

    this.logger.info('Register routes for FavoritesController...');
    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [
        new AuthorizedMiddleware(),
      ]
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Post,
      handler: this.change,
      middlewares: [
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
        new AuthorizedMiddleware(),
      ]
    });
  }

  public async change({body, params}: Request, res: Response) : Promise<void> {
    const offer = params.offerId;
    const user = res.locals.user.id;
    const rdo = plainToInstance(ChangeFavoriteRdo, body, { excludeExtraneousValues: true });

    const offerRdo = rdo.isFavorite ?
      await this.favoritesService.add(offer, user) :
      await this.favoritesService.delete(offer, user);
    // const favoriteOffer = await this.offerService.findByIdWithUser(rec.offer.id, rec.user.id);
    // if (favoriteOffer) {
    //   favoriteOffer.isFavorite = rdo.isFavorite;
    // }
    this.ok(res, offerRdo);
  }

  public async index(_req: Request, res: Response) : Promise<void> {
    const user = res.locals.user.id;
    const offers = this.favoritesService.select(user);
    this.ok(res, fillDTO(OfferItemRdo, offers));
  }
}
