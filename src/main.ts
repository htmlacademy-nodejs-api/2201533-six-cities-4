import 'reflect-metadata';
import RestApplication from './app/rest.js';
import {Container} from 'inversify';
import {AppComponent} from './types/app-component.enum.js';
import {createRestApplicationContainer} from './app/rest.container.js';
import {createUserContainer} from './modules/user/user.container.js';
import {createOfferContainer} from './modules/offer/offer.container.js';
import {createCityContainer} from './modules/city/city.container.js';
import {createCommentContainer} from './modules/comments/comment.container.js';
import {createFavoritesContainer} from './modules/favorites/favorites.container.js';

async function bootstrap() {
  const mainContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createOfferContainer(),
    createCityContainer(),
    createCommentContainer(),
    createFavoritesContainer()
  );
  const application = mainContainer.get<RestApplication>(AppComponent.RestApplication);
  await application.init();
}

bootstrap();
