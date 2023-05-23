import {OfferServiceInterface} from './offer-service.interface.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import {DocumentType} from '@typegoose/typegoose';
import {OfferEntity} from './offer.entity.js';

export default class OfferService implements OfferServiceInterface {
  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const offer = new OfferEntity(dto);
  }

}
