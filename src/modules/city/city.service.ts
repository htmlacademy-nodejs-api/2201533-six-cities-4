import {CityServiceInterface} from './city-service.interface.js';
import {injectable, inject} from 'inversify';
import {AppComponent} from '../../types/app-component.enum.js';
import {LoggerInterface} from '../../core/logger/logger.interface.js';
import {types} from '@typegoose/typegoose';
import {CityEntity} from './city.entity.js';

@injectable()
export default class CityService implements CityServiceInterface {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.CityModel) private readonly cityModel: types.ModelType<CityEntity>
  ) {}
}
