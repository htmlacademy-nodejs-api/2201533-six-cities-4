import {Expose} from 'class-transformer';

export default class OfferItemRdo {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public city!: string;

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
