import LocationDto from '../local/local.dto';
class CreateOfferFields {
  public title!: string;
  public description!: string;
  public city!: string;
  public isPremium!: boolean;
  public type!: string;
  public bedrooms!: number;
  public maxAdults!: number;
  public price!: number;
  public goods!: string[];
  public location!: LocationDto;
  public previewImage!: string;
  public images!: string[];
}

export default class CreateOfferDto {
  public offer!: CreateOfferFields;
  public previewImage!: File;
  public images!: File[];
}
