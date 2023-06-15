import {OfferServiceInterface} from './offer-service.interface.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {OfferEntity} from './offer.entity.js';
import {inject, injectable} from 'inversify';
import {AppComponent} from '../../types/app-component.enum.js';
import {LoggerInterface} from '../../core/logger/logger.interface.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import CreateCommentDto from '../comments/dto/create-comment.dto.js';
import {IMAGES_COUNT, SORT_DEFAULT} from '../consts.js';
import {OfferFilterType} from '../../types/offer.types.js';
import {ConfigInterface} from '../../core/config/config.interface.js';
import {RestSchema} from '../../core/config/rest.schema.js';
import {CommentServiceInterface} from '../comments/comment.service.interface.js';
import {CommentEntity} from '../comments/comment.entity.js';
import fs from 'node:fs';
import path from 'node:path';
import {FavoritesServiceInterface} from '../favorites/favorites.service.interface.js';

@injectable()
export default class OfferService implements OfferServiceInterface {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(AppComponent.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(AppComponent.ConfigInterface) private readonly config: ConfigInterface<RestSchema>,
    @inject(AppComponent.FavoritesModel) private readonly favoritesService: FavoritesServiceInterface
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return this.findById(result.id);
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId).populate(['city', 'host']).exec();
  }

  public async checkUserIsHost(userId: string, offerId: string): Promise<boolean> {
    const offer = await this.findById(offerId);
    return (offer?.host.id === userId);
  }

  private async deleteImages(files: string[]) {
    files.forEach(
      (file) => fs.unlink(path.join(this.config.get('UPLOAD_DIRECTORY'), file), () => console.log)
    );
  }

  public async update(dto:UpdateOfferDto, idOffer: string): Promise<DocumentType<OfferEntity> | null> {
    let forDelete: string[] = [];
    const fromDto = dto.images?.slice();
    if (dto.images) {
      const offer = await this.findById(idOffer);
      const images = dto.images.concat(offer ? offer.images : []);
      const forAdd = images.filter((_, index) => index < IMAGES_COUNT);
      forDelete = images.filter((_, index) => index >= IMAGES_COUNT);
      dto.images = forAdd;
    }

    try {
      await this.offerModel.findByIdAndUpdate(idOffer, dto).exec();
    } catch (err) {
      forDelete = fromDto ? fromDto : [];
      console.log(err);
      return null;
    } finally {
      await this.deleteImages(forDelete);
    }
    this.logger.info(`Update offer: ${dto.title}`);
    return this.findById(idOffer);
  }

  public async addComment(id: string, dto: CreateCommentDto): Promise<DocumentType<CommentEntity> | null> {
    const offer = await this.findById(id);
    if (!offer) {
      throw new Error(`Offer with id: ${id} not found.`);
    }
    const count = offer.commentsCount + 1;
    offer.rating = (offer.rating * offer.commentsCount + dto.rating) / count;
    offer.commentsCount = count;
    await offer.save();
    return await this.commentService.create(dto, offer.title);
  }

  public async delete(id: string): Promise<DocumentType<OfferEntity> | null> {
    await this.commentService.deleteByOffer(id);
    const offer = await this.offerModel.findByIdAndDelete(id);
    if (offer) {
      const forDelete = offer.images;
      forDelete.push(offer.previewImage);
      await this.deleteImages(forDelete);
    }
    return offer;
  }

  public async select(params: OfferFilterType, user: string | null): Promise<DocumentType<OfferEntity>[]> {
    const offerLimit = params.limit ? params.limit : this.config.get('RESPONSE_OFFER_LIMIT');
    const offerSort = params.sort ? params.sort : SORT_DEFAULT;
    const dto = params.dto ? params.dto : {};
    const result = await this.offerModel
      .find(dto)
      .sort(offerSort)
      .limit(offerLimit)
      .populate(['city', 'host'])
      .exec();
    result.map(async (offer) => {
      offer.isFavorite = user ? await this.favoritesService.check(offer.id, user) : false;
      return offer;
    });
    return result;
  }

  public async exists(offerId: string): Promise<boolean> {
    return (await this.offerModel
      .exists({_id: offerId})) !== null;
  }
}
