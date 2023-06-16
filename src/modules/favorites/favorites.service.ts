import {inject, injectable} from 'inversify';
import {FavoritesServiceInterface} from './favorites.service.interface.js';
import {AppComponent} from '../../types/app-component.enum.js';
import {types} from '@typegoose/typegoose';
import {FavoritesEntity} from './favorites.entity.js';
import {DocumentType} from '@typegoose/typegoose';

@injectable()
export default class FavoritesService implements FavoritesServiceInterface {
  constructor(
    @inject(AppComponent.FavoritesModel) private readonly favoritesModel: types.ModelType<FavoritesEntity>,
  ) {}

  public async check(offerId: string, userId: string): Promise<boolean> {
    return await this.favoritesModel.where({user: userId, offer: offerId}).countDocuments() > 0;
  }

  public async add(offer: string, user: string): Promise<DocumentType<FavoritesEntity>> {
    return await this.favoritesModel.create({user, offer});
  }

  public async delete(offer: string, user: string): Promise<DocumentType<FavoritesEntity> | null> {
    return await this.favoritesModel.findOneAndDelete({user, offer});
  }

  public async select(user: string): Promise<void> {
    const favorites = await this.favoritesModel.find({user}).populate(['offer']).exec();
    console.log(favorites);
  }
}
