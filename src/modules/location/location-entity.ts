import {MapLocation} from '../../types/location.type.js';
import {prop} from '@typegoose/typegoose';
import CreateLocationDto from './dto/create-location.dto.js';

export class LocationEntity implements MapLocation {
  @prop({required: true, type: Number})
  public latitude = 0;

  @prop({required: true, type: Number})
  public longitude = 0;

  constructor(dto: CreateLocationDto) {
    this.latitude = dto.latitude;
    this.longitude = dto.longitude;
  }
}
