import {CommentServiceInterface} from './comment.service.interface.js';
import {AppComponent} from '../../types/app-component.enum.js';
import {LoggerInterface} from '../../core/logger/logger.interface.js';
import {inject} from 'inversify';
import {DocumentType, types} from '@typegoose/typegoose';
import {CommentEntity} from './comment.entity.js';
import CreateCommentDto from './dto/create-comment.dto.js';
import OfferService from '../offer/offer.service.js';

export default class CommentService implements CommentServiceInterface {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(AppComponent.OfferServiceInterface) private readonly offerService: OfferService
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const result = await this.commentModel.create(dto);
    const offerTitle = await this.offerService.onAddComment(dto.offer, dto.rating);
    this.logger.info(`Added new comment for offer: ${offerTitle}`);
    return result;
  }
}
