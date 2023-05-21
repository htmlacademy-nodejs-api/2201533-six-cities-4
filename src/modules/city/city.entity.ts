import {defaultClasses, getModelForClass, prop} from '@typegoose/typegoose';
import {City} from '../../types/city.type.js';
import {LocationEntity} from '../location/location-entity.js';
import {cityName} from '../../types/cities.enum.js';

export interface CityEntity extends defaultClasses.Base {}

export class CityEntity extends defaultClasses.TimeStamps implements City {
  @prop({required: true, enum: cityName})
  public name = '';

  @prop({required: true})
  public location!: LocationEntity;
}

export const CityModel = getModelForClass(CityEntity);
