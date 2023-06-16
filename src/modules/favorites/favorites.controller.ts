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
// import {plainToInstance} from 'class-transformer';
// import ChangeFavoriteRdo from './rdo/change-favorite.rdo.js';
// import {DocumentType} from '@typegoose/typegoose';
// import {OfferEntity} from '../offer/offer.entity.js';
import OfferRdo from '../offer/rdo/offer.rdo.js';

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
    // let call: (offer: string, user: string) => Promise<DocumentType<OfferEntity> | null>;

    if (rdo.isFavorite) {
    //   call = this.favoritesService.add;
    // } else {
    //   call = this.favoritesService.delete;
    // }
    // console.log(call);
    const rec = await this.favoritesService.add(offer, user);
    console.log(rec);
    const favoriteOffer = await this.offerService.findById(rec.offer.toString());
    if (favoriteOffer) {
      favoriteOffer.isFavorite = true;
    }
    this.ok(res, fillDTO(OfferRdo, favoriteOffer));
  }

  public async index(_req: Request, res: Response) : Promise<void> {
    const user = res.locals.user.id;
    const offers = this.favoritesService.select(user);
    this.ok(res, fillDTO(OfferItemRdo, offers));
  }
}
