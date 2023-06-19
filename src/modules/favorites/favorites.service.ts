import {inject, injectable} from 'inversify';
import {FavoritesServiceInterface} from './favorites.service.interface.js';
import {AppComponent} from '../../types/app-component.enum.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {FavoritesEntity} from './favorites.entity.js';

@injectable()
export default class FavoritesService implements FavoritesServiceInterface {
  constructor(
    @inject(AppComponent.FavoritesModel) private readonly favoritesModel: types.ModelType<FavoritesEntity>,
  ) {}

  public async check(offerId: string, userId: string): Promise<boolean> {
    return (await this.favoritesModel.exists({user: userId, offer: offerId})) !== null;
  }

  public async add(offer: string, user: string): Promise<DocumentType<FavoritesEntity>> {
    let added = await this.favoritesModel.findOne({offer, user}).exec();
    if (!added){
      added = await this.favoritesModel.create({user, offer});
    }
    // return added;
    return await this.favoritesModel
      .findById(added.id)
      .populate({path: 'offer', populate: ['city', 'host']}) as DocumentType<FavoritesEntity>;
    // const addedOffer = fillDTO(OfferRdo, favorite);
    // // addedOffer.isFavorite = true;
    // // console.log(addedOffer.city.id);
    // return addedOffer;
  }

  public async delete(offer: string, user: string): Promise<DocumentType<FavoritesEntity> | null> {
    console.log('delete');
    return await this.favoritesModel
      .findOneAndDelete({user, offer})
      .populate({path: 'offer', populate: ['city', 'host']}).exec();
    // const deletedOffer = await this.offerService.findById(offer);
    // deletedOffer.isFavorite = false;
    // return deletedOffer;
  }

  public async select(user: string): Promise<DocumentType<FavoritesEntity>[]> {
    return await this.favoritesModel.find({user}).populate({path: 'offer', populate: ['city', 'host']}).exec();
    // const offers: DocumentType<OfferEntity>[] = [];
    //
    // const promises = favorites.map((item) => this.offerService.findById(item.offer.id, user).then(
    //   (offer) => {
    //     offers.push(offer as DocumentType<OfferEntity>);
    //   }
    // ));
    // await Promise.all(promises);
    // return offers;
  }
}
