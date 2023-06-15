import {Container} from 'inversify';
import {AppComponent} from '../../types/app-component.enum.js';
import {types} from '@typegoose/typegoose';
import {FavoritesEntity, FavoritesModel} from './favorites.entity.js';
import FavoritesService from './favorites.service.js';
import {FavoritesServiceInterface} from './favorites.service.interface.js';
import {ControllerInterface} from '../../core/controller/controller-interface.js';
import FavoritesController from './favorites.controller.js';

export function createFavoritesContainer() {
  const favoritesContainer = new Container();
  favoritesContainer.bind<FavoritesServiceInterface>(AppComponent.FavoritesServiceInterface).to(FavoritesService);
  favoritesContainer.bind<types.ModelType<FavoritesEntity>>(AppComponent.FavoritesModel).toConstantValue(FavoritesModel);
  favoritesContainer.bind<ControllerInterface>(AppComponent.FavoritesController).to(FavoritesController).inSingletonScope();
  return favoritesContainer;
}
