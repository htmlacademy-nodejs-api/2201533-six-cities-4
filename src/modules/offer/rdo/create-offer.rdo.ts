import {Expose, Transform, Type} from 'class-transformer';
import LocationRdo from '../../location/rdo/location.rdo.js';
import dayjs from 'dayjs';

export default class CreateOfferRdo {
  @Expose()
  public title!: string;

  @Expose()
  public city!: string;

  @Expose()
  @Transform(({value}) => value.length > 0 ? value[0] : '')
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
  @Transform(() => dayjs().toISOString())
  public date!: string;

  @Expose()
  @Transform(() => false)
  public isFavorite!: boolean;

  @Expose()
  @Transform(() => 0)
  public rating!: number;

  @Expose({name: 'count'})
  @Transform(() => 0)
  public commentsCount!: number;

  @Expose()
  public description!: string;

  @Expose({})
  public bedrooms!: number;

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
