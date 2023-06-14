import {Container} from 'inversify';
import {AppComponent} from '../../types/app-component.enum.js';
import {types} from '@typegoose/typegoose';
import {FavoritesEntity, FavoritesModel} from './favorites.entity.js';

export function createFavoritesContainer() {
  const favoritesContainer = new Container();
  favoritesContainer.bind<types.ModelType<FavoritesEntity>>(AppComponent.FavoritesModel).toConstantValue(FavoritesModel);
  return favoritesContainer;
}
