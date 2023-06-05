import {Request, Response} from 'express';
import {Controller} from '../../core/controller/controller-abstract.js';
import {inject} from 'inversify';
import {AppComponent} from '../../types/app-component.enum.js';
import {LoggerInterface} from '../../core/logger/logger.interface.js';
import {OfferServiceInterface} from '../offer/offer-service.interface.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import HttpError from '../../core/errors/http-error.js';
import {StatusCodes} from 'http-status-codes';
import {fillDTO} from '../../core/helpers/common.js';
import CommentRdo from './rdo/comment.rdo.js';
import {CommentServiceInterface} from './comment.service.interface.js';

export default class CommentController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface) logger: LoggerInterface,
    @inject(AppComponent.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(AppComponent.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
  ) {
    super(logger);

    this.logger.info('Register routes for CommentController…');
    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.create});
    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
  }

  public async index(req: Request, res: Response) : Promise<void> {
    const offerId = req.params.offerId;
    if (!await this.offerService.exists(offerId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        'CommentController'
      );
    }
    const comments = await this.commentService.deleteByOffer(offerId);
    this.ok(res, fillDTO(CommentRdo, comments));
  }

  public async create(req: Request, res: Response): Promise<void> {
    const offerId = req.params.offerId;
    if (!await this.offerService.exists(offerId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        'CommentController'
      );
    }
    const comment = await this.offerService.addComment(offerId, req.body);
    this.created(res, fillDTO(CommentRdo, comment));
  }
}
