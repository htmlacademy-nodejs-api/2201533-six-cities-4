import {City} from './city.type';

export enum cityName {
  Paris = 'Paris',
  Cologne = 'Cologne',
  Brussels = 'Brussels',
  Amsterdam = 'Amsterdam',
  Hamburg = 'Hamburg',
  Dusseldorf = 'Dusseldorf',
}

export const cities = {
  Paris: <City>{
    name: cityName.Paris,
    location: {latitude: 48.85661, longitude: 2.351499}
  },
  Cologne: <City>{
    name: cityName.Cologne,
    location: {latitude: 50.938361, longitude: 6.959974}
  },
  Brussels: <City>{
    name: cityName.Brussels,
    location: {latitude: 50.846557, longitude: 4.351697}
  },
  Amsterdam: <City>{
    name: cityName.Amsterdam,
    location: {latitude: 52.370216, longitude: 4.895168}
  },
  Hamburg: <City>{
    name: cityName.Hamburg,
    location: {latitude: 53.550341, longitude: 10.000654}
  },
  Dusseldorf: <City>{
    name: cityName.Dusseldorf,
    location: {latitude: 51.225402, longitude: 6.776314}
  },
};
