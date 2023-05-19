type TypeOfUser = 'pro' | 'simple';

export type User = {
  name: string;
  email: string;
  avatarPath: string;
  password: string;
  type: TypeOfUser;
};
