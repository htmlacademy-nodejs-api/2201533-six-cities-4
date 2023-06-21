import CityDto from '../city/city.dto.js';
import LocationDto from '../local/local.dto.js';

export default class OfferItemDto {
  public id!: string;
  public price!: number;
  public rating!: number;
  public title!: string;
  public isPremium!: boolean;
  public isFavorite!: boolean;
  public city!: CityDto;
  public location!: LocationDto;
  public previewImage!: string;
  public type!: string;
  public date!: string;
  public count!: number;
}
