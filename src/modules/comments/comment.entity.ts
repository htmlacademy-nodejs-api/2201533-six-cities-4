import {defaultClasses, getModelForClass, modelOptions, prop, Ref} from '@typegoose/typegoose';
import {entitiesName} from '../../types/entities-name.enum.js';
import {UserEntity} from '../user/user.entity.js';
import {OfferEntity} from '../offer/offer.entity.js';

export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({options: {customName: entitiesName.comments}})
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({required: true, type: Date})
  public date!: Date;

  @prop({required: true, type: String})
  public text!: string;

  @prop({required: true, type: Number})
  public rating!: number;

  @prop({ref: UserEntity, required: true, _id: false})
  public author!: Ref<UserEntity>;

  @prop({ref: OfferEntity, required: true, _id: false})
  public offer!: Ref<OfferEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);
