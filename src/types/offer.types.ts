import {City} from './city.type';
import {MapLocation} from './location.type';
import CityOfferFilterDto from '../modules/offer/dto/offer-filter.dto.js';
import {SortOrder} from 'mongoose';

export type Offer = {
  title: string;
  description: string;
  date: Date;
  city: City;
  previewImage: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: string;
  bedrooms: number;
  maxAdults: number;
  price: number;
  goods: string[];
  host: string;
  commentsCount: number;
  location: MapLocation;
}

export type OfferFilterType = {
  dto?: CityOfferFilterDto;
  sort?: { [key: string]: SortOrder; };
  limit?: number;
}
