import {inject, injectable} from 'inversify';
import {Request, Response} from 'express';
import {Controller} from '../../core/controller/controller-abstract.js';
import {AppComponent} from '../../types/app-component.enum.js';
import {LoggerInterface} from '../../core/logger/logger.interface.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {OfferServiceInterface} from './offer-service.interface.js';
import OfferItemRdo from './rdo/offer-item.rdo.js';
import {fillDTO, getOffersParams} from '../../core/helpers/common.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import OfferRdo from './rdo/offer.rdo.js';
import OfferFilterDto from './dto/offer-filter.dto.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import {ObjectIdValidator} from '../middlewares/validators/object-id.validator.js';
import {ValidateDtoMiddleware} from '../middlewares/validators/dto.validator.js';
import {LocationInstanceMiddleware} from '../middlewares/location-instance.middleware.js';
import {DocumentExistsMiddleware} from '../middlewares/document-exists.middleware.js';
// import {UserServiceInterface} from '../user/user-service.interface.js';
import {ConfigInterface} from '../../core/config/config.interface.js';
import {RestSchema} from '../../core/config/rest.schema.js';
import {BusboyMiddleware} from '../middlewares/busboy.middleware.js';
import CreateOfferRdo from './rdo/create-offer.rdo.js';
// import HttpError from '../../core/errors/http-error.js';
// import {StatusCodes} from 'http-status-codes';
import UpdateOfferRdo from './rdo/update-offer.rdo.js';
import {offerImageFields} from '../consts.js';
import {TrimLikeRdoMiddleware} from '../middlewares/trim-like-rdo.middleware.js';
import {IsHostMiddleware} from '../middlewares/authenticate/is-host.middleware.js';
import {AuthorizedMiddleware} from '../middlewares/authenticate/authorized.middleware.js';

@injectable()
export default class OfferController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(AppComponent.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
    // @inject(AppComponent.UserServiceInterface) private readonly userService: UserServiceInterface,
    @inject(AppComponent.ConfigInterface) private readonly configService: ConfigInterface<RestSchema>
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.create,
      middlewares: [
        new AuthorizedMiddleware(),
        new BusboyMiddleware(
          this.configService.get('UPLOAD_DIRECTORY'),
          offerImageFields,
          'offer',
          CreateOfferRdo
        ),
        new LocationInstanceMiddleware,
        new ValidateDtoMiddleware(CreateOfferDto)
      ]}
    );
    this.addRoute({path: '/:offerId', method: HttpMethod.Get, handler: this.show,
      middlewares: [
        new ObjectIdValidator('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]}
    );
    this.addRoute({path: '/:offerId', method: HttpMethod.Patch, handler: this.patch,
      middlewares: [
        new ObjectIdValidator('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
        new AuthorizedMiddleware(),
        new IsHostMiddleware(this.offerService),
        new BusboyMiddleware(
          this.configService.get('UPLOAD_DIRECTORY'),
          offerImageFields,
          'offer',
          UpdateOfferRdo
        ),
        new TrimLikeRdoMiddleware(UpdateOfferRdo),
        new LocationInstanceMiddleware,
        new ValidateDtoMiddleware(UpdateOfferDto, true)
      ]}
    );
    this.addRoute({path: '/:offerId', method: HttpMethod.Delete, handler: this.delete,
      middlewares: [
        new ObjectIdValidator('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
        new AuthorizedMiddleware(),
        new IsHostMiddleware(this.offerService)
      ]}
    );
  }

  public async index (req: Request, res: Response): Promise<void> {
    const user = res.locals.user.id ?? null;
    const dto = fillDTO(OfferFilterDto, req.query);
    const offers = await this.offerService.select(getOffersParams(dto, req.query), user);
    const offersToResponse = fillDTO(OfferItemRdo, offers);
    this.ok(res, offersToResponse);
  }

  public async create({ body }: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
    res: Response): Promise<void> {
    const userId = res.locals.user.id;
    const result = await this.offerService.create({...body, host: userId});
    this.created(res, fillDTO(OfferRdo, result));
  }

  public async show(req: Request, res: Response): Promise<void> {
    const offerId = req.params.offerId;
    const result = await this.offerService.findById(offerId);
    this.ok(res, fillDTO(OfferRdo, result));
  }

  public async patch({body, params}: Request<Record<string, unknown>, Record<string, string>, UpdateOfferDto>,
    res: Response): Promise<void> {
    const offerId = params.offerId as string;
    const result = await this.offerService.update(body, offerId);
    this.ok(res, fillDTO(OfferRdo, result));
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const offerId = req.params.offerId as string;
    const offer = await this.offerService.delete(offerId);
    this.noContent(res, offer);
  }
}
