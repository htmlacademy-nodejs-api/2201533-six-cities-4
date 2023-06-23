import OfferItemDto from '../dto/offer/offer-item.dto.js';
import {Comment, Offer, OfferItem, Type} from '../types/types.js';
import OfferDto from '../dto/offer/offer.dto';
import {UserType} from '../const';
import CommentDto from '../dto/comment/comment.dto';

export const adaptOffersToClient = (offers: OfferItemDto[]): OfferItem[] =>
  offers.map((offer) => ({
    id: offer.id,
    price: offer.price,
    rating: offer.rating,
    title: offer.title,
    isPremium: offer.isPremium,
    isFavorite: offer.isFavorite,
    previewImage: offer.previewImage,
    type: offer.type as Type,
    city: {
      name: offer.city.name,
      location: {
        latitude: offer.city.location.latitude,
        longitude: offer.city.location.longitude
      }
    },
    location: {
      latitude: offer.location.latitude,
      longitude: offer.location.longitude
    },
  }));

export const adaptOfferToClient = (offer: OfferDto): Offer =>
  ({
    id: offer.id,
    price: offer.price,
    rating: offer.rating,
    title: offer.title,
    isPremium: offer.isPremium,
    isFavorite: offer.isFavorite,
    city: {
      name: offer.city.name,
      location: {
        latitude: offer.city.location.latitude,
        longitude: offer.city.location.longitude
      }
    },
    location: {
      latitude: offer.location.latitude,
      longitude: offer.location.longitude
    },
    previewImage: offer.previewImage,
    type: offer.type as Type,
    bedrooms: offer.rooms,
    description: offer.description,
    goods: offer.goods,
    host: {
      name: offer.host.name,
      avatarUrl: offer.host.avatarPath,
      type: offer.host.type === UserType.Pro ? UserType.Pro : UserType.Regular,
      email: offer.host.email
    },
    images: offer.images,
    maxAdults: offer.maxAdults,
  });

export const adaptCommentToClient = (comment: CommentDto): Comment => ({
  id: comment.offer,
  comment: comment.text,
  date: comment.date,
  rating: comment.rating,
  user: {
    name: comment.author.name,
    avatarUrl: comment.author.avatarPath,
    type: comment.author.type === UserType.Pro ? UserType.Pro : UserType.Regular,
    email: comment.author.email
  }
});

export const adaptCommentsToClient = (comments: CommentDto[]): Comment[] =>
  comments.map((comment) => adaptCommentToClient(comment));
