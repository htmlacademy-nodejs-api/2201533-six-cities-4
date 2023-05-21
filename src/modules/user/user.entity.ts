import {User, UserType} from '../../types/user.type.js';
import {defaultClasses, getModelForClass, prop} from '@typegoose/typegoose';
import {createSHA256} from '../../core/helpers/common.js';

export interface UserEntity extends defaultClasses.Base {}

export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({required: true})
  public name = '';

  @prop({required: true, unique: true})
  public email = '';

  @prop({required: false, default: ''})
  public avatarPath = '';

  @prop({required: true})
  private password?: string;

  @prop({required: true, enum: UserType})
  public type = '' as unknown as UserType;

  constructor(userData: User) {
    super();

    this.email = userData.email;
    this.avatarPath = userData.avatarPath;
    this.name = userData.name;
    this.type = userData.type;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
