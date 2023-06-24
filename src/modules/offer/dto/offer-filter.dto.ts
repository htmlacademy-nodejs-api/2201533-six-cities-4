import {Expose} from 'class-transformer';

export default class OfferFilterDto {
  @Expose()
  public city?: string;

  @Expose()
  public isPremium?: boolean;
}
