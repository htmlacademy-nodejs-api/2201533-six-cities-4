import * as crypto from 'node:crypto';
import {ClassConstructor, plainToInstance} from 'class-transformer';
import * as QueryString from 'qs';
import {OfferFilterType} from '../../types/offer.types.js';
import OfferFilterDto from '../../modules/offer/dto/offer-filter.dto.js';

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '';
}

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};

export function fillDTO<T, V>(someDto: ClassConstructor<T>, plainObject: V) {
  return plainToInstance(someDto, plainObject, {
    excludeExtraneousValues: true,
    exposeUnsetFields: false,
  });
}

export function getOffersParams<T extends OfferFilterDto | undefined>(dto: T, query: QueryString.ParsedQs) {
  const params: OfferFilterType = {dto: dto};
  if (Object.keys(query).includes('count')) {
    params.limit = parseInt(query.count as string, 10);
  }
  return params;
}

export function createErrorObject(message: string) {
  return {
    error: message,
  };
}
