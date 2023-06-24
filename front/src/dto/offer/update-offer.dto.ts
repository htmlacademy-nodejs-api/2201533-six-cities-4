import LocationDto from '../local/local.dto';

export class UpdateFieldsDto {
  public title?: string;
  public description?: string;
  public isPremium?: boolean;
  public type?: string;
  public bedrooms?: number;
  public maxAdults?: number;
  public price?: number;
  public goods?: string[];
  public city?: string;
  public location?: LocationDto;
}

export class UpdateOfferDto {
  public offer!: UpdateFieldsDto;
  public previewImage?: File;
  public images?: File[];
}

export class UpdateOfferProps {
  public dto!: UpdateOfferDto;
  public id!: string;
}
