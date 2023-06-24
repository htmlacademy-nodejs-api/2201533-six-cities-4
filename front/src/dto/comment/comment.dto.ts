import UserDto from '../user/user.dto';

export default class CommentDto {
  public date!: string;
  public text!: string;
  public rating!: number;
  public author!: UserDto;
  public offer!: string;
}
