import {UserRegister} from '../types/types.js';
import CreateUserDto from '../dto/user/create-user.dto.js';
import {UserTypeServer} from '../const';


export const adaptSignupToServer =
  (user: UserRegister): CreateUserDto => ({
    user: {
      name: user.name,
      type: UserTypeServer[user.type],
      email: user.email,
      password: user.password,
    },
    avatar: user.avatar,
  });
