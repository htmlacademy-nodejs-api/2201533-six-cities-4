import {FavoritesEntity} from './favorites.entity.js';
import {DocumentType} from '@typegoose/typegoose';

export interface FavoritesServiceInterface {
  check(offerId: string, userId: string): Promise<boolean>;
  delete(offer: string, user: string): Promise<DocumentType<FavoritesEntity> | null>;
  select(user: string): Promise<DocumentType<FavoritesEntity>[]>;
  add(offer: string, user: string): Promise<DocumentType<FavoritesEntity>>;
  deleteByOffer(offer: string): Promise<number>
}

