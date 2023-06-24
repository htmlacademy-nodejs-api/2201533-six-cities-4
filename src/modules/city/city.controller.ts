import {Controller} from '../../core/controller/controller-abstract.js';
import {inject, injectable} from 'inversify';
import {AppComponent} from '../../types/app-component.enum.js';
import {LoggerInterface} from '../../core/logger/logger.interface.js';
import {OfferServiceInterface} from '../offer/offer-service.interface.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {CityServiceInterface} from './city-service.interface.js';
import {Request, Response} from 'express';
import {fillDTO, getOffersParams} from '../../core/helpers/common.js';
import OfferItemRdo from '../offer/rdo/offer-item.rdo.js';
import CityRdo from './rdo/city.rdo.js';
import CityOfferFilterDto from '../offer/dto/offer-filter.dto.js';
import {ConfigInterface} from '../../core/config/config.interface.js';
import {RestSchema} from '../../core/config/rest.schema.js';

@injectable()
export default class CityController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(AppComponent.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
    @inject(AppComponent.CityServiceInterface) private readonly cityService: CityServiceInterface,
    @inject(AppComponent.ConfigInterface) configService: ConfigInterface<RestSchema>,
  ) {
    super(logger, configService);

    this.logger.info('Register routes for CityController…');

    this.addRoute({path: '', method: HttpMethod.Get, handler: this.index});
    this.addRoute({path: '/:city', method: HttpMethod.Get, handler: this.byCity});
  }

  public async index (_req: Request, res: Response): Promise<void> {
    const cities = await this.cityService.find();
    const citiesToResponse = fillDTO(CityRdo, cities);
    this.ok(res, citiesToResponse);
  }

  public async byCity (req: Request, res: Response): Promise<void> {
    const cityName = req.params.city;
    const city = await this.cityService.findByName(cityName);
    if (!city){
      const errorMessage = `City with name «${cityName}» not found.`;
      this.notFound(res, errorMessage);
      return this.logger.error(errorMessage);
    }
    const dto = fillDTO(CityOfferFilterDto, req.query);
    const user = res.locals.user.id ?? null;
    dto.city = city.id;

    const offers = await this.offerService.select(getOffersParams(dto, req.query), user);
    const offersToResponse = fillDTO(OfferItemRdo, offers);
    this.ok(res, offersToResponse);
  }
}
