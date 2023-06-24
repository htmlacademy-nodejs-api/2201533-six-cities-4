import {Expose, Type} from 'class-transformer';
import LocationRdo from '../../location/rdo/location.rdo.js';

export default class CityRdo {
  @Expose()
  public id!: string;

  @Expose()
  public name!: string;

  @Type(() => LocationRdo)
  @Expose()
  public location!: LocationRdo;
}
