import {IsLatitude, IsLongitude} from 'class-validator';

export default class CreateLocationDto {
  @IsLatitude()
  public latitude!: number;

  @IsLongitude()
  public longitude!: number;
}
