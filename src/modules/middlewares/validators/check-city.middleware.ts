import {MiddlewareInterface} from '../../../types/middleware.interface.js';
import {NextFunction, Request, Response} from 'express';
import {Types} from 'mongoose';
import HttpError from '../../../core/errors/http-error.js';
import {StatusCodes} from 'http-status-codes';
import {cityName} from '../../../types/cities.enum.js';
import {CityServiceInterface} from '../../city/city-service.interface.js';

export class CheckCityMiddleware implements MiddlewareInterface {
  constructor(private cityService: CityServiceInterface) {
  }

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const {body} = req;
    const cityId = body.city;
    if (Types.ObjectId.isValid(cityId)) {
      return next();
    }
    console.log('CheckCityMiddleware: ', cityName[cityId as keyof typeof cityName]);
    if (cityName[cityId as keyof typeof cityName]) {
      const city = await this.cityService.findByName(cityId);
      body.city = city?.id;
      console.log('CheckCityMiddleware city id: ', body.city);
      return next();
    }
    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `${cityId} is invalid cities name or id`,
      'CheckCityMiddleware'
    );
  }
}
