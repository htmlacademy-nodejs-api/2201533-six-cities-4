import CreateCommentDto from './dto/create-comment.dto.js';
import {DocumentType} from '@typegoose/typegoose';
import {CommentEntity} from './comment.entity.js';

export interface CommentServiceInterface {
  create(dto: CreateCommentDto, offerTitle: string): Promise<DocumentType<CommentEntity> | null>;
  deleteByOffer(offerId: string): Promise<void>;
  findByOffer(offerId: string): Promise<DocumentType<CommentEntity>[]>;
}
