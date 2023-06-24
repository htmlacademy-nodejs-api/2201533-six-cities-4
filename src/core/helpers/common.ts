import * as crypto from 'node:crypto';
import {ClassConstructor, plainToInstance} from 'class-transformer';
import * as QueryString from 'qs';
import {OfferFilterType} from '../../types/offer.types.js';
import OfferFilterDto from '../../modules/offer/dto/offer-filter.dto.js';
import {ValidationError} from 'class-validator';
import {ValidationErrorField} from '../../types/validation-error.types-field.js';
import {ServiceError} from '../../types/service-error.enum.js';
import {DEFAULT_STATIC_IMAGES} from '../../app/consts.js';
import {UnknownRecord} from '../../types/unknown-record.type.js';

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

export function createErrorObject(serviceError: ServiceError, message: string, details: ValidationErrorField[] = []) {
  return {
    errorType: serviceError,
    message,
    details: [...details],
  };
}

export function transformErrors(errors: ValidationError[]): ValidationErrorField[] {
  return errors.map(({property, value, constraints}) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : []
  }));
}

export function getFullServerPath(host: string, port: number) {
  return `http://${host}:${port}`;
}

function isObject(value: unknown) {
  return typeof value === 'object' && value !== null;
}

export function transformProperty(
  property: string,
  someObject: UnknownRecord,
  transformFn: (object: UnknownRecord) => void
) {
  return Object.keys(someObject)
    .forEach((key) => {
      if (key === property) {
        transformFn(someObject);
      } else if (isObject(someObject[key])) {
        transformProperty(property, someObject[key] as UnknownRecord, transformFn);
      }
    });
}

export function transformObject(properties: string[], staticPath: string, uploadPath: string, data:UnknownRecord) {
  const createPath = (fileName: string) => {
    const rootPath = DEFAULT_STATIC_IMAGES.includes(fileName) ? staticPath : uploadPath;
    return `${rootPath}/${fileName}`;
  };

  return properties
    .forEach((property) => {
      transformProperty(property, data, (target: UnknownRecord) => {
        if (Array.isArray(target[property])) {
          target[property] = (target[property] as string[]).map((item) => createPath(item));
        } else {
          target[property] = createPath(target[property] as string);
        }
      });
    });
}
