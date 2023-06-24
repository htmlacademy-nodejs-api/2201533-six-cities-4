import {Expose, Type} from 'class-transformer';
import UserRdo from '../../user/rdo/user.rdo.js';

export default class CommentRdo {
  @Expose()
  public date!: string;

  @Expose()
  public text!: string;

  @Expose()
  public rating!: number;

  @Expose()
  @Type(() => UserRdo)
  public author!: UserRdo;

  @Expose()
  public offer!: string;
}
