import {Expose, Type} from 'class-transformer';
import LocationRdo from '../../location/rdo/location.rdo.js';

export default class OfferRdo {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public city!: string;

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

  @Expose()
  public rooms!: number;

  @Expose()
  public maxAdults!: number;

  @Expose()
  public goods!: string[];

  @Expose()
  public host!: string;

  @Expose()
  @Type(() => LocationRdo)
  public location!: LocationRdo;
}
