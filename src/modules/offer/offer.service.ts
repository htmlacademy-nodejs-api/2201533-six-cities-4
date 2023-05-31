import {OfferServiceInterface} from './offer-service.interface.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {OfferEntity} from './offer.entity.js';
import {inject, injectable} from 'inversify';
import {AppComponent} from '../../types/app-component.enum.js';
import {LoggerInterface} from '../../core/logger/logger.interface.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import CommentService from '../comments/comment.service.js';
import CreateCommentDto from '../comments/dto/create-comment.dto.js';

@injectable()
export default class OfferService implements OfferServiceInterface {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(AppComponent.CommentServiceInterface) private readonly commentService: CommentService
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId).exec();
  }

  public async update(dto:UpdateOfferDto, idOffer: string): Promise<DocumentType<OfferEntity> | null> {
    try {
      await this.offerModel.updateOne({id: idOffer}, dto).exec();
    } catch (_) {
      return null;
    }
    this.logger.info(`Update offer: ${dto.title}`);
    return await this.findById(idOffer);
  }

  public async addComment(id: string, dto: CreateCommentDto): Promise<void> {
    const offer = await this.findById(id);
    if (!offer) {
      throw new Error(`Offer with id: ${id} not found.`);
    }
    const count = offer.commentsCount + 1;
    offer.rating = (offer.rating * offer.commentsCount + dto.rating) / count;
    offer.commentsCount = count;
    await offer.save();
    await this.commentService.create(dto, offer.title);
  }

  public async delete(id: string): Promise<void> {
    await this.commentService.deleteByOffer(id);
    await this.offerModel.findByIdAndDelete(id);
  }
}
