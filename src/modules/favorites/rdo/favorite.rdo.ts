import OfferRdo from '../../offer/rdo/offer.rdo.js';
import {Expose, Transform} from 'class-transformer';

export default class FavoriteRdo extends OfferRdo {
  @Expose()
  @Transform(() => true)
  public isFavorite!: boolean;
}
