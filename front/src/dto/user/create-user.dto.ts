class CreateUserFields {
  public email!: string;
  public name!: string;
  public type!: string;
  public password!: string;
}

export default class CreateUserDto {
  public user!: CreateUserFields;
  public avatar?: File;
}
