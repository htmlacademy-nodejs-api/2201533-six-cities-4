import {UserServiceInterface} from './user-service.interface.js';
import CreateUserDto from './dto/create-user.dto.js';
import {UserEntity} from './user.entity.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {inject, injectable} from 'inversify';
import {AppComponent} from '../../types/app-component.enum.js';
import {LoggerInterface} from '../../core/logger/logger.interface.js';
import LoginUserDto from './dto/login-user.dto.js';
import {NIL as uuidNil, v4 as uuidV4} from 'uuid';

@injectable()
export default class UserService implements UserServiceInterface {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async create(dto:CreateUserDto, salt:string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);
    const result = this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return result;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({email});
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }

  public async findById(userId: string): Promise<DocumentType<UserEntity> | null> {
    return await this.userModel.findById(userId).exec();
  }

  public async verifyToken(userId: string, tokenId: string): Promise<boolean> {
    const user = await this.findById(userId);
    if (user) {
      return user.tokenId === tokenId;
    }
    return false;
  }

  public async resetToken(userId: string) {
    const user = await this.findById(userId);
    if (user) {
      user.tokenId = uuidNil;
      await user.save();
    }
  }

  public async verifyUser(dto: LoginUserDto, salt: string): Promise<DocumentType<UserEntity> | null> {
    const user = await this.findByEmail(dto.email);

    if (! user) {
      return null;
    }

    if (user.verifyPassword(dto.password, salt)) {
      user.tokenId = uuidV4();
      await user.save();
      return user;
    }

    return null;
  }
}
