import CreateOfferDto from './dto/create-offer.dto.js';
import {DocumentType} from '@typegoose/typegoose';
import {OfferEntity} from './offer.entity.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import CreateCommentDto from '../comments/dto/create-comment.dto.js';
import {OfferFilterType} from '../../types/offer.types.js';
import {CommentEntity} from '../comments/comment.entity.js';

export interface OfferServiceInterface {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  update(dto: UpdateOfferDto, idOffer: string): Promise<DocumentType<OfferEntity> | null>
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  addComment(offerId: string, dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  delete(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  select(params: OfferFilterType): Promise<DocumentType<OfferEntity>[]>;
  exists(offerId: string): Promise<boolean>;
}
