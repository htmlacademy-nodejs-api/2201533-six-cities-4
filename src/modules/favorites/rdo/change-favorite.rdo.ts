import {Expose} from "class-transformer";

export default class ChangeFavoriteRdo {
  @Expose()
  public isFavorite!: boolean;
}
