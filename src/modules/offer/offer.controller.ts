import {inject, injectable} from 'inversify';
import { Request, Response } from 'express';
import {Controller} from '../../core/controller/controller-abstract.js';
import {AppComponent} from '../../types/app-component.enum.js';
import {LoggerInterface} from '../../core/logger/logger.interface.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {OfferServiceInterface} from './offer-service.interface.js';

@injectable()
export default class OfferController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(AppComponent.OfferServiceInterface) private readonly offerService: OfferServiceInterface
  ) {
    super(logger);

    this.logger.info('Register routes for CategoryController…');

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.create});
  }

  public async index (_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.select({});
    this.ok(res, offers);
  }

  public create(_req: Request, _res: Response): void {
    // Код обработчика
  }
}
