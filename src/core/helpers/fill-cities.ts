import CityService from '../../modules/city/city.service.js';
import ConsoleLoggerService from '../logger/console.service.js';
import {CityModel} from '../../modules/city/city.entity.js';
import {cities} from '../../types/cities.enum.js';

export const fillCities = async () => {
  const logger = new ConsoleLoggerService();
  const cityService = new CityService(logger, CityModel);
  const cityValues = Object.values(cities);
  logger.info(`cities count = ${await cityService.getCount()}`);
  if (await cityService.getCount() === cityValues.length) {
    return;
  }
  for (const city of cityValues) {
    await cityService.create(city);
  }
};
