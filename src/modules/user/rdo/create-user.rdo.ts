import {UserType} from '../../../types/user.type.js';
import {Expose, Transform} from 'class-transformer';
import {DEFAULT_AVATAR_FILE_NAME} from '../../consts.js';

export default class CreateUserRdo {
  @Expose()
  public email!: string;

  @Expose({name: 'avatar'})
  @Transform(({value}) => typeof value === 'string' ? DEFAULT_AVATAR_FILE_NAME : value[0])
  public avatarPath!: string;

  @Expose()
  public name!: string;

  @Expose()
  public type!: UserType;

  @Expose()
  public password!: string;
}
