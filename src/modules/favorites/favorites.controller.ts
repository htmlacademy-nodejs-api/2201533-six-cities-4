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
import {plainToInstance} from 'class-transformer';
import ChangeFavoriteRdo from './rdo/change-favorite.rdo.js';
import {FavoritesEntity} from './favorites.entity.js';
import {DocumentType} from '@typegoose/typegoose';
import OfferItemRdo from '../offer/rdo/offer-item.rdo.js';
import OfferRdo from '../offer/rdo/offer.rdo.js';
import {ConfigInterface} from '../../core/config/config.interface.js';
import {RestSchema} from '../../core/config/rest.schema.js';

export default class FavoritesController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface) logger: LoggerInterface,
    @inject(AppComponent.FavoritesServiceInterface) private readonly favoritesService: FavoritesServiceInterface,
    @inject(AppComponent.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
    @inject(AppComponent.ConfigInterface) configService: ConfigInterface<RestSchema>,
  ) {
    super(logger, configService);

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
    const favorite = rdo.isFavorite ?
      await this.favoritesService.add(offer, user) :
      await this.favoritesService.delete(offer, user) as DocumentType<FavoritesEntity>;
    this.ok(res, {...fillDTO(OfferRdo, favorite.offer), isFavorite: rdo.isFavorite });
  }

  public async index(_req: Request, res: Response) : Promise<void> {
    const user = res.locals.user.id;
    const offers = (await this.favoritesService.select(user)).map((item) =>
      ({...fillDTO(OfferItemRdo, item.offer), isFavorite: true}));
    this.ok(res, offers);
  }
}
