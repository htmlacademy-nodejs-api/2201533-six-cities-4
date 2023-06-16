import CreateOfferDto from './dto/create-offer.dto.js';
import {DocumentType} from '@typegoose/typegoose';
import {OfferEntity} from './offer.entity.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import CreateCommentDto from '../comments/dto/create-comment.dto.js';
import {OfferFilterType} from '../../types/offer.types.js';
import {CommentEntity} from '../comments/comment.entity.js';
import {DocumentExistsInterface} from '../../types/document-exists.interface.js';

export interface OfferServiceInterface extends DocumentExistsInterface{
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  update(dto: UpdateOfferDto, idOffer: string): Promise<DocumentType<OfferEntity> | null>
  findById(offerId: string, user?: string): Promise<DocumentType<OfferEntity> | null>;
  addComment(offerId: string, dto: CreateCommentDto): Promise<DocumentType<CommentEntity> | null>;
  delete(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  select(params: OfferFilterType, user: string | null): Promise<DocumentType<OfferEntity>[]>;
  exists(offerId: string): Promise<boolean>;
  checkUserIsHost(userId: string, offerId: string): Promise<boolean>;
}
