import {Expose, Transform, Type} from 'class-transformer';
import LocationRdo from '../../location/rdo/location.rdo.js';

export default class UpdateOfferRdo {
  @Expose()
  public title?: string;

  @Transform(({value}) => value.length > 0 ? value[0] : '')
  public previewImage?: string;

  @Expose()
  public images?: string[];

  @Expose()
  public isPremium?: boolean;

  @Expose()
  public type?: string;

  @Expose()
  public price?: number;

  @Expose()
  public description?: string;

  @Expose()
  public bedrooms?: number;

  @Expose()
  public maxAdults?: number;

  @Expose()
  public goods?: string[];

  @Expose()
  @Type(() => LocationRdo)
  public location?: LocationRdo;

  @Expose()
  public city?: string;
}
