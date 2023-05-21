import {MapLocation} from '../../../types/location.type.js';

export default class CreateCityDto {
  public name!: string;
  public location!: MapLocation;
}
