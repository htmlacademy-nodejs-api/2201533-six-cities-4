import {NewOffer, UserRegister} from '../types/types.js';
import CreateUserDto from '../dto/user/create-user.dto.js';
import {UserTypeServer} from '../const';
import CreateOfferDto from '../dto/offer/create-offer.dto';

export const adaptSignupToServer =
  (user: UserRegister): CreateUserDto => ({
    user: {
      name: user.name,
      type: UserTypeServer[user.type],
      email: user.email,
      password: user.password,
    },
    avatar: user.avatar,
  });

export const adaptCreateOfferToServer =
  (newOffer: NewOffer): CreateOfferDto => ({
    offer: {
      title: newOffer.title,
      description: newOffer.description,
      city: newOffer.city.name,
      isPremium: newOffer.isPremium,
      type: newOffer.type.substring(0, 1).toUpperCase().concat(newOffer.type.substring(1)),
      bedrooms: newOffer.bedrooms,
      maxAdults: newOffer.maxAdults,
      price: newOffer.price,
      goods: newOffer.goods,
      location: newOffer.location,
      previewImage: '',
      images: []
    },
    previewImage: newOffer.previewImage,
    images: newOffer.images
  });
