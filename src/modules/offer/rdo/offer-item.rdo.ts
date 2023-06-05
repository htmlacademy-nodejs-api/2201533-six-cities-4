import {Expose, Type} from 'class-transformer';
import CityRdo from '../../city/rdo/city.rdo.js';

export default class OfferItemRdo {
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
}
