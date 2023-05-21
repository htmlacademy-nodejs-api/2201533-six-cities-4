import {defaultClasses} from "@typegoose/typegoose";
import {Offer} from "../../types/offer.type";
import {City} from "../../types/city.type";
import {MapLocation} from "../../types/location.type";

export interface OfferEntity extends defaultClasses.Base {}

export class OfferEntity extends defaultClasses.TimeStamps implements Offer {
  public title!: string;
  public description!: string;
  public date!: Date;
  public city!: City;
  public previewImage!: string;
  public images!: string[];
  public isPremium!: boolean;
  public isFavorite!: boolean;
  public rating!: number;
  public type!: string;
  public bedrooms!: number;
  public maxAdults!: number;
  public price!: number;
  public goods!: string[];
  public host!: number;
  public commentsCount!: number;
  public location!: MapLocation;
}
