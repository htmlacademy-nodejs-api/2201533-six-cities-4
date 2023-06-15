import {DocumentType} from '@typegoose/typegoose';
import {OfferEntity} from '../offer/offer.entity.js';

export interface FavoritesServiceInterface {
  check(offerId: string, userId: string): Promise<boolean>;
  delete(offer: string, user: string): Promise<DocumentType<OfferEntity> | null>;
  select(user: string): Promise<void>;
  add(offer: string, user: string): Promise<DocumentType<OfferEntity> | null>;
}

