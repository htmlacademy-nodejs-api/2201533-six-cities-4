import {UserType} from '../../../types/user.type.js';
import {Expose, Transform} from 'class-transformer';

export default class CreateUserRdo {
  @Expose()
  public email!: string;

  @Expose({name: 'avatar'})
  @Transform(({value}) => value.length > 0 ? value[0] : '')
  public avatarPath!: string;

  @Expose()
  public name!: string;

  @Expose()
  public type!: UserType;

  @Expose()
  public password!: string;
}
