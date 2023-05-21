import {MapLocation} from '../../types/location.type.js';
import {prop} from '@typegoose/typegoose';

export class LocationEntity implements MapLocation {
  @prop({required: true})
  public latitude = 0;

  @prop({required: true})
  public longitude = 0;
}
