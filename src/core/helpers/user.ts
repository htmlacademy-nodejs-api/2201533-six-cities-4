import CreateUserDto from '../../modules/user/dto/create-user.dto.js';
import {UserType} from '../../types/user.type.js';

export function createUser(rawRow: string): CreateUserDto {
  const [email, avatarPath, name, type, password] = rawRow.split('\t');
  return {
    email,
    avatarPath,
    name,
    type : UserType[type as keyof typeof UserType],
    password
  };
}
