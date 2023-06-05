import {Expose} from 'class-transformer';

export default class CityOfferFilterDto {
  public city?: string;

  @Expose()
  public isPremium?: boolean;

  @Expose()
  public isFavorite?: boolean;
}
