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

  @Expose()
  public description!: string;

  @Expose()
  public rooms!: number;

  @Expose()
  public maxAdults!: number;

  @Expose({name: 'amenities'})
  public goods!: string[];

  @Expose()
  public host!: string;


  location:
      latitude:
      longitude:

}
