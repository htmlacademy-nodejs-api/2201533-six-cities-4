import {CommentServiceInterface} from './comment.service.interface.js';
import {AppComponent} from '../../types/app-component.enum.js';
import {LoggerInterface} from '../../core/logger/logger.interface.js';
import {inject, injectable} from 'inversify';
import {DocumentType, types} from '@typegoose/typegoose';
import {CommentEntity} from './comment.entity.js';
import CreateCommentDto from './dto/create-comment.dto.js';
import {LIMIT_COMMENT, SORT_DEFAULT} from '../consts.js';

@injectable()
export default class CommentService implements CommentServiceInterface {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,

  ) {}

  public async create(dto: CreateCommentDto, offerTitle: string): Promise<DocumentType<CommentEntity> | null> {
    const result = await this.commentModel.create(dto);
    this.logger.info(`Added new comment for offer: ${offerTitle}`);
    return await this.findById(result.id);
  }

  private async findById(commId: string): Promise<DocumentType<CommentEntity> | null> {
    return this.commentModel.findById(commId).populate(['author']).exec();
  }

  public async deleteByOffer(offerId: string): Promise<void> {
    await this.commentModel.deleteMany({offer: offerId});
  }

  public async findByOffer(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return await this.commentModel
      .find({offer: offerId})
      .sort(SORT_DEFAULT)
      .limit(LIMIT_COMMENT)
      .populate(['author'])
      .exec();
  }
}
