import {Controller} from '../../core/controller/controller-abstract.js';
import {inject, injectable} from 'inversify';
import {AppComponent} from '../../types/app-component.enum.js';
import {LoggerInterface} from '../../core/logger/logger.interface.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {CityServiceInterface} from './city-service.interface.js';
import {Request, Response} from 'express';
import {fillDTO} from '../../core/helpers/common.js';
import CityRdo from './rdo/city.rdo.js';
import {ConfigInterface} from '../../core/config/config.interface.js';
import {RestSchema} from '../../core/config/rest.schema.js';

@injectable()
export default class CityController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(AppComponent.CityServiceInterface) private readonly cityService: CityServiceInterface,
    @inject(AppComponent.ConfigInterface) configService: ConfigInterface<RestSchema>,
  ) {
    super(logger, configService);

    this.logger.info('Register routes for CityController…');

    this.addRoute({path: '', method: HttpMethod.Get, handler: this.index});
  }

  public async index (_req: Request, res: Response): Promise<void> {
    const cities = await this.cityService.find();
    const citiesToResponse = fillDTO(CityRdo, cities);
    this.ok(res, citiesToResponse);
  }
}
