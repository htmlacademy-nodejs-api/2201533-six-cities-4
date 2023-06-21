import {
  ArrayMaxSize,
  ArrayMinSize,
  Equals, IsArray,
  IsDateString,
  IsEnum, IsInt,
  IsMongoId, Max,
  MaxLength, Min,
  MinLength, ValidateNested
} from 'class-validator';
import {OfferType} from '../../../types/offer-type.enum.js';
import CreateLocationDto from '../../location/dto/create-location.dto.js';
import {Goods} from '../../../types/goods.enum.js';

export default class CreateOfferDto {
  @MinLength(10, {message: 'Minimum title length must be 10'})
  @MaxLength(100, {message: 'Maximum title length must be 100'})
  public title!: string;

  @MinLength(20, {message: 'Minimum description length must be 20'})
  @MaxLength(1024, {message: 'Maximum description length must be 1024'})
  public description!: string;

  @IsDateString({}, {message: 'postDate must be valid ISO date'})
  public date!: Date;

  @IsMongoId({message: 'City field must be valid an id'})
  public city!: string;

  public previewImage!: string;

  @ArrayMinSize(6, {message: ''})
  @ArrayMaxSize(6, {message: ''})
  public images!: string[];

  public isPremium!: boolean;

  public isFavorite!: boolean;

  @Equals(0, {message: ''})
  public rating!: number;

  @IsEnum(OfferType, {message: ''})
  public type!: string;

  @IsInt({message: ''})
  @Max(8, {message: ''})
  @Min(1, {message: ''})
  public bedrooms!: number;

  @IsInt({message: ''})
  @Max(10, {message: ''})
  @Min(1, {message: ''})
  public maxAdults!: number;

  @IsInt({message: ''})
  @Max(100000, {message: ''})
  @Min(100, {message: ''})
  public price!: number;

  @IsArray()
  @IsEnum(Goods, {each: true, message: ''})
  public goods!: string[];

  public host!: string;

  @IsInt({message: ''})
  public commentsCount!: number;

  @ValidateNested()
  public location!: CreateLocationDto;
}
