import {User, UserType} from '../../types/user.type.js';
import {defaultClasses, getModelForClass, modelOptions, prop} from '@typegoose/typegoose';
import {createSHA256} from '../../core/helpers/common.js';
import {entitiesName} from '../../types/entities-name.enum.js';

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({options: {customName: entitiesName.users}})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({required: true, type: String})
  public name = '';

  @prop({required: true, unique: true, type: String})
  public email = '';

  @prop({required: false, default: '', type: String})
  public avatarPath = '';

  @prop({required: true})
  private password?: string;

  @prop({required: true, enum: UserType, type: String})
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
