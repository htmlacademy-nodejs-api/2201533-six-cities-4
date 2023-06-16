import OfferRdo from '../offer/rdo/offer.rdo.js';

export interface FavoritesServiceInterface {
  check(offerId: string, userId: string): Promise<boolean>;
  delete(offer: string, user: string): Promise<OfferRdo>;
  select(user: string): Promise<void>;
  add(offer: string, user: string): Promise<OfferRdo>;
}

