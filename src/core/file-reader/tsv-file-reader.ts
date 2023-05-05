import { readFileSync } from 'node:fs';
import { FileReaderInterface } from './file-reader.interface.js';
import { Offer } from '../../types/offer.type.js';
import {cities} from '../../types/cities.enum';
import {Goods} from '../../types/goods.enum';
import {OfferType} from '../../types/offer-type.enum';

export default class TSVFileReader implements FileReaderInterface {
  private rawData = '';

  constructor(public filename: string) { }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf8' });
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      return [];
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map(([title, description, date, city, previewImage, images, isPremium,
        isFavorite, rating, type, bedrooms, maxAdults, price, goods,
        host, commentsCount, location]) => ({
        title,
        description,
        date: new Date(date),
        city: cities[city as keyof typeof cities],
        previewImage,
        images: images.split(';'),
        isPremium: isPremium.trim().toUpperCase() === 'TRUE',
        isFavorite: isFavorite.trim().toUpperCase() === 'TRUE',
        rating: parseFloat(rating),
        type: OfferType[type as keyof typeof OfferType],
        bedrooms: parseInt(bedrooms, 10),
        maxAdults: parseInt(maxAdults, 10),
        price: parseInt(price, 10),
        goods: goods.split(';').map((good) => Goods[good as keyof typeof Goods]),
        host: parseInt(host, 10),
        commentsCount: parseInt(commentsCount, 10),
        location: {latitude: 0, longitude: 0}
        // location: location.split().map(([latitude, longitude]) => ({
        //   latitude: parseFloat(latitude),
        //   longitude: parseFloat(longitude)
        // })),
      }));
  }
}
