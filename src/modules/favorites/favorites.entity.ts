import {defaultClasses, getModelForClass, modelOptions, prop, Ref} from '@typegoose/typegoose';
import {entitiesName} from '../../types/entities-name.enum.js';
import {UserEntity} from '../user/user.entity.js';
import {OfferEntity} from '../offer/offer.entity.js';

@modelOptions({options: {customName: entitiesName.favorites}})
export class FavoritesEntity extends defaultClasses.TimeStamps {
  @prop({ref: UserEntity, required: true, _id: false})
  public author!: Ref<UserEntity>;

  @prop({ref: OfferEntity, required: true, _id: false})
  public offer!: Ref<OfferEntity>;
}

export const FavoritesModel = getModelForClass(FavoritesEntity);
