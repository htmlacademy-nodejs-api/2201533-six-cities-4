import {UserType} from '../../../types/user.type.js';
import {IsEmail, IsEnum, MaxLength, MinLength} from 'class-validator';

export default class CreateUserDto {
  @IsEmail()
  public email!: string;

  public avatarPath!: string;

  @MinLength(1)
  @MaxLength(15)
  public name!: string;

  @IsEnum(UserType)
  public type!: UserType;

  @MaxLength(12)
  @MinLength(6)
  public password!: string;
}
