import {Expose, Transform} from 'class-transformer';
import {BooleanEnum} from '../../../types/boolean-enum.js';

export default class ChangeFavoriteRdo {
  @Expose()
  @Transform(({value}) => BooleanEnum[value.toLowerCase() as keyof typeof BooleanEnum])
  public isFavorite!: boolean;
}
