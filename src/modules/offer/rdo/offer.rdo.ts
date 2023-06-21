import {Expose, Type} from 'class-transformer';
import LocationRdo from '../../location/rdo/location.rdo.js';
import CityRdo from '../../city/rdo/city.rdo.js';
import UserRdo from '../../user/rdo/user.rdo.js';

export default class OfferRdo {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  @Type(() => CityRdo)
  public city!: CityRdo;

  @Expose()
  public previewImage!: string;

  @Expose()
  public images!: string[];

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public type!: string;

  @Expose()
  public price!: number;

  @Expose()
  public date!: string;

  @Expose()
  public isFavorite!: boolean;

  @Expose()
  public rating!: number;

  @Expose({name: 'commentsCount'})
  public count!: number;

  @Expose()
  public description!: string;

  @Expose({name: 'bedrooms'})
  public rooms!: number;

  @Expose()
  public maxAdults!: number;

  @Expose()
  public goods!: string[];

  @Expose()
  @Type(() => UserRdo)
  public host!: UserRdo;

  @Expose()
  @Type(() => LocationRdo)
  public location!: LocationRdo;
}
