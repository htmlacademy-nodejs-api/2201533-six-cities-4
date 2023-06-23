import {City, EditOfferProps, NewOffer, UserRegister} from '../types/types.js';
import CreateUserDto from '../dto/user/create-user.dto.js';
import {UserTypeServer} from '../const';
import CreateOfferDto from '../dto/offer/create-offer.dto';
import {UpdateOfferDto, UpdateOfferProps} from '../dto/offer/update-offer.dto';
import {FormFieldName} from '../components/offer-form/offer-form';


const excludedFields = [
  FormFieldName.images,
  FormFieldName.previewImage,
];

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

export const adaptUpdateOfferToServer =
  ({offer, fields}: EditOfferProps): UpdateOfferProps => {
    const updateOffer = Object.fromEntries(Object.entries(offer).filter(([k, v]) =>
      fields.has(k) && !excludedFields.includes(k as FormFieldName) && k !== 'id'));
    if (updateOffer[FormFieldName.cityName]) {
      updateOffer.city = (updateOffer[FormFieldName.cityName] as City).name;
    }
    if (updateOffer[FormFieldName.type]) {
      updateOffer[FormFieldName.type] = (updateOffer[FormFieldName.type] as string)
        .substring(0 ,1).toUpperCase()
        .concat((updateOffer[FormFieldName.type] as string).substring(1));
    }
    const pictures = Object.fromEntries(Object.entries(offer).filter(([k, v]) =>
      fields.has(k) && excludedFields.includes(k as FormFieldName)));
    const dto: UpdateOfferDto = Object.assign({},{
      offer: updateOffer
    }, pictures);
    return {
      dto: dto,
      id: offer.id
    };
  };
