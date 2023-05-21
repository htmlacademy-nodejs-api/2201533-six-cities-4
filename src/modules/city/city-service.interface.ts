import CreateCityDto from './dto/create-city.dto.js';
import {DocumentType} from '@typegoose/typegoose';
import {CityEntity} from './city.entity.js';

export interface CityServiceInterface {
  create(dto: CreateCityDto): Promise<DocumentType<CityEntity>>;
}
