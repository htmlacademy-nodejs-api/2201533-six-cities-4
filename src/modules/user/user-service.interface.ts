import CreateUserDto from './dto/create-user.dto.js';
import { DocumentType } from '@typegoose/typegoose';
import {UserEntity} from './user.entity.js';
import LoginUserDto from './dto/login-user.dto.js';

export interface UserServiceInterface {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  updateAvatar(path: string, userId: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findById(userId: string): Promise<DocumentType<UserEntity> | null>;
  verifyUser(dto: LoginUserDto, salt: string): Promise<DocumentType<UserEntity> | null>;
  verifyToken(userId: string): Promise<boolean>;
  resetToken(userId: string): void;
}
