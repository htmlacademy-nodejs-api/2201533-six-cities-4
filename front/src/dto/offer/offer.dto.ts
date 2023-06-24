import OfferItemDto from './offer-item.dto';
import UserDto from '../user/user.dto';

export default class OfferDto extends OfferItemDto{
  rooms!: number;
  description!: string;
  goods!: string[];
  host!: UserDto;
  images!: string[];
  maxAdults!: number;
}
