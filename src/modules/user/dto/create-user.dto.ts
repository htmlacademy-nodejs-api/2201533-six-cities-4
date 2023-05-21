import {UserType} from '../../../types/user.type.js';

export default class CreateUserDto {
  public email!: string;
  public avatarPath!: string;
  public name!: string;
  public type!: UserType;
  public password!: string;
}
