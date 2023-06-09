export const AppComponent = {
  RestApplication: Symbol.for('RestApplication'),
  LoggerInterface: Symbol.for('LoggerInterface'),
  ConfigInterface: Symbol.for('ConfigInterface'),
  DatabaseInterface: Symbol.for('DatabaseInterface'),
  UserServiceInterface: Symbol.for('UserServiceInterface'),
  OfferServiceInterface: Symbol.for('OfferServiceInterface'),
  CityServiceInterface: Symbol.for('CityServiceInterface'),
  CommentServiceInterface: Symbol.for('CommentServiceInterface'),
  FavoritesServiceInterface: Symbol.for('FavoritesServiceInterface'),
  UserModel: Symbol.for('UserModel'),
  CityModel: Symbol.for('CityModel'),
  OfferModel: Symbol.for('OfferModel'),
  CommentModel: Symbol.for('CommentModel'),
  FavoritesModel: Symbol.for('FavoritesModel'),
  OfferController: Symbol.for('OfferController'),
  UserController: Symbol.for('UserController'),
  CityController: Symbol.for('CityController'),
  CommentController: Symbol.for('CommentController'),
  FavoritesController: Symbol.for('FavoritesController'),
  HttpErrorExceptionFilter: Symbol.for('HttpErrorExceptionFilter'),
  BaseExceptionFilter: Symbol.for('BaseExceptionFilter'),
  ValidationExceptionFilter: Symbol.for('ValidationExceptionFilter'),
} as const;
