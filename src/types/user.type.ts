export enum UserType {
  pro = 'pro',
  simple = 'simple'
}

export interface User {
  name: string;
  email: string;
  avatarPath: string;
  type: UserType;
}
