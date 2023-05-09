import { OfferGeneratorInterface } from './offer-generator.interface.js';
import {MockData} from '../../types/mock-data.type.js';
import {
  generateRandomValue,
  getRandomBoolean,
  getRandomItem,
  getRandomItems,
  makeFakeLocation
} from '../../core/helpers/random.js';
import {cities} from '../../types/cities.enum.js';
import {
  BASE_DATE,
  BoolkinString,
  Max,
  Min,
  NumberFields,
  Precision,
  UNIT_DURATION
} from '../../core/cli-consts/consts.js';
import {OfferType} from '../../types/offer-type.enum.js';
import {Goods} from '../../types/goods.enum.js';

const getRandomizeParam = (key: string) =>
  ([
    Min[key as keyof typeof Min] || Min.Default,
    Max[key as keyof typeof Max] || Max.Default,
    Precision[key as keyof typeof Precision] || Precision.Default,
  ] as [number, number, number]);

export default class OfferGenerator implements OfferGeneratorInterface {
  constructor(private readonly mockData: MockData) {}

  public generate(): string {
    const title = getRandomItem(this.mockData.titles);
    const description = getRandomItem(this.mockData.descriptions);
    const date = BASE_DATE.subtract(generateRandomValue(...getRandomizeParam(NumberFields.Duration)), UNIT_DURATION);
    const city = getRandomItem(Object.values(cities));
    const images = getRandomItems(this.mockData.images, 6);
    const previewImage = getRandomItem(images);
    const isPremium = getRandomBoolean();
    const isFavorite = getRandomBoolean();
    const rating = generateRandomValue(...getRandomizeParam(NumberFields.Rating));
    const type = getRandomItem(Object.values(OfferType));
    const bedrooms = generateRandomValue(...getRandomizeParam(NumberFields.Bedrooms));
    const maxAdults = generateRandomValue(...getRandomizeParam(NumberFields.MaxAdults));
    const price = generateRandomValue(...getRandomizeParam(NumberFields.Price));
    const goods = getRandomItems(Object.values(Goods));
    const host = generateRandomValue(0, this.mockData.emails.length);
    const commentsCount = generateRandomValue(...getRandomizeParam(NumberFields.CommentCount));
    const location = makeFakeLocation(city.location);

    return [
      [title, description, date.toISOString(), city.name, previewImage, images.join(';'),
        BoolkinString.get(isPremium), BoolkinString.get(isFavorite), rating, type, bedrooms, maxAdults,
        price, goods.join(';'), host, commentsCount, location.latitude, location.longitude]
    ].join('\t');
  }
}
