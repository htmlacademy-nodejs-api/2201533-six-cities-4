import {inject, injectable} from 'inversify';
import {FavoritesServiceInterface} from './favorites.service.interface.js';
import {AppComponent} from '../../types/app-component.enum.js';
import {types} from '@typegoose/typegoose';
import {FavoritesEntity} from './favorites.entity.js';
import {DocumentType} from '@typegoose/typegoose';
import {fillDTO} from '../../core/helpers/common.js';
import OfferRdo from '../offer/rdo/offer.rdo.js';

@injectable()
export default class FavoritesService implements FavoritesServiceInterface {
  constructor(
    @inject(AppComponent.FavoritesModel) private readonly favoritesModel: types.ModelType<FavoritesEntity>,
  ) {}

  public async check(offerId: string, userId: string): Promise<boolean> {
    console.log('check');
    return await this.favoritesModel.where({user: userId, offer: offerId}).countDocuments() > 0;
  }

  public async add(offer: string, user: string): Promise<OfferRdo> {
    const id = await this.favoritesModel.create({user, offer});
    const favorite = await this.favoritesModel.findById(id).populate('offer').exec() as DocumentType<FavoritesEntity>;
    const createdOffer = fillDTO(OfferRdo, favorite.offer);
    createdOffer.isFavorite = true;
    return createdOffer;
  }

  public async delete(offer: string, user: string): Promise<OfferRdo> {
    const favorite = await this.favoritesModel.findOneAndDelete({user, offer}).exec();
    const deletedOffer = fillDTO(OfferRdo, favorite?.offer);
    deletedOffer.isFavorite = false;
    return deletedOffer;
  }

  public async select(user: string): Promise<void> {
    const favorites = await this.favoritesModel.find({user}).populate(['offer']).exec();
    console.log(favorites);
  }
}
