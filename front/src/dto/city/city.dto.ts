import LocationDto from '../local/local.dto.js';

export default class CityDto {
  public id!: string;
  public name!: string;
  public location!: LocationDto;
}
