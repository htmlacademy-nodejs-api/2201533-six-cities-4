import {defaultClasses, getModelForClass, modelOptions, prop} from '@typegoose/typegoose';
import {City} from '../../types/city.type.js';
import {LocationEntity} from '../location/location-entity.js';
import {cities} from '../../types/cities.enum.js';
import {entitiesName} from '../../types/entities-name.enum.js';

export interface CityEntity extends defaultClasses.Base {}

@modelOptions({options: {customName: entitiesName.cities}})
export class CityEntity extends defaultClasses.TimeStamps implements City {
  @prop({
    required: true,
    enum: Object.values(cities).map((city) => city.name),
    type: String
  })
  public name = '';

  @prop({required: true, _id: false})
  public location!: LocationEntity;

  constructor(city: City) {
    super();

    this.name = city.name;
    this.location = new LocationEntity(city.location);
  }
}

export const CityModel = getModelForClass(CityEntity);
