import CreateOfferDto from './dto/create-offer.dto.js';
import {DocumentType} from '@typegoose/typegoose';
import {OfferEntity} from './offer.entity.js';
import UpdateOfferDto from './dto/update-offer.dto.js';

export interface OfferServiceInterface {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  update(dto: UpdateOfferDto, idOffer: string): Promise<DocumentType<OfferEntity> | null>
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  onAddComment(offerId: string, rating: number): Promise<string>;
}
