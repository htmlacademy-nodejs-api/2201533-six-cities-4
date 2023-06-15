import {inject, injectable} from 'inversify';
import {FavoritesServiceInterface} from './favorites.service.interface.js';
import {AppComponent} from '../../types/app-component.enum.js';
import {types, DocumentType} from '@typegoose/typegoose';
import {FavoritesEntity} from './favorites.entity.js';
import {OfferEntity} from '../offer/offer.entity.js';
import {OfferServiceInterface} from '../offer/offer-service.interface.js';

@injectable()
export default class FavoritesService implements FavoritesServiceInterface {
  constructor(
    @inject(AppComponent.FavoritesModel) private readonly favoritesModel: types.ModelType<FavoritesEntity>,
    @inject(AppComponent.CommentServiceInterface) private readonly offerService: OfferServiceInterface
  ) {}

  public async check(offerId: string, userId: string): Promise<boolean> {
    return await this.favoritesModel.where({user: userId, offer: offerId}).countDocuments() > 0;
  }

  public async add(offer: string, user: string): Promise<DocumentType<OfferEntity> | null> {
    await this.favoritesModel.create({user, offer});
    const obj = await this.offerService.findById(offer);
    if(obj) {
      obj.isFavorite = true;
    }
    return obj;
  }

  public async delete(offer: string, user: string): Promise<DocumentType<OfferEntity> | null> {
    await this.favoritesModel.findOneAndDelete({user, offer});
    const obj = await this.offerService.findById(offer);
    if(obj) {
      obj.isFavorite = false;
    }
    return obj;
  }

  public async select(user: string): Promise<void> {
    const favorites = await this.favoritesModel.find({user}).populate(['offer']).exec();
    console.log(favorites);
  }
}
