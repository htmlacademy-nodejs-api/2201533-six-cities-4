import {Expose} from 'class-transformer';
import {IsArray, IsBooleanString, IsEnum, IsInt, Max, MaxLength, Min, MinLength, ValidateNested} from 'class-validator';
import {OfferType} from '../../../types/offer-type.enum.js';
import {Goods} from '../../../types/goods.enum.js';
import CreateLocationDto from '../../location/dto/create-location.dto.js';

export default class UpdateOfferDto {
  @MinLength(10, {message: 'Minimum title length must be 10'})
  @MaxLength(100, {message: 'Maximum title length must be 100'})
  public title?: string;

  @MinLength(20, {message: 'Minimum description length must be 20'})
  @MaxLength(1024, {message: 'Maximum description length must be 1024'})
  public description?: string;

  @Expose()
  public previewImage?: string;

  @Expose()
  public images?: string[];

  @IsBooleanString({message: 'isPremium must be a boolean value'})
  public isPremium?: boolean;

  @IsEnum(OfferType, {message: ''})
  public type?: string;

  @IsInt({message: ''})
  @Max(8, {message: ''})
  @Min(1, {message: ''})
  public bedrooms?: number;

  @IsInt({message: ''})
  @Max(10, {message: ''})
  @Min(1, {message: ''})
  public maxAdults?: number;

  @IsInt({message: ''})
  @Max(100000, {message: ''})
  @Min(100, {message: ''})
  public price?: number;

  @IsArray()
  @IsEnum(Goods, {each: true, message: ''})
  public goods?: string[];

  @ValidateNested()
  public location?: CreateLocationDto;
}
