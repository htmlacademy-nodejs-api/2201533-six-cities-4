import {Max, MaxLength, Min, MinLength} from 'class-validator';

export default class CreateCommentDto {
  public date!: Date;
  @MaxLength(1024)
  @MinLength(5)
  public text!: string;

  @Min(1)
  @Max(5)
  public rating!: number;

  public author!: string;
  public offer!: string;
}
