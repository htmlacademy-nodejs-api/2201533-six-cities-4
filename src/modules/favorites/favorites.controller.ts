import {Controller} from "../../core/controller/controller-abstract";
import {inject} from "inversify";
import {AppComponent} from "../../types/app-component.enum";
import {LoggerInterface} from "../../core/logger/logger.interface";
import {HttpMethod} from "../../types/http-method.enum";
import {DocumentExistsMiddleware} from "../middlewares/document-exists.middleware";
import {AuthorizedMiddleware} from "../middlewares/authenticate/authorized.middleware";
import {ValidateDtoMiddleware} from "../middlewares/validators/dto.validator";
import CreateCommentDto from "../comments/dto/create-comment.dto";
import {Request, Response} from "express";
import HttpError from "../../core/errors/http-error";
import {StatusCodes} from "http-status-codes";
import {fillDTO} from "../../core/helpers/common";
import CommentRdo from "../comments/rdo/comment.rdo";
import dayjs from "dayjs";
import {FavoritesServiceInterface} from "./favorites.service.interface";

export default class FavoritesController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface) logger: LoggerInterface,
    @inject(AppComponent.FavoritesServiceInterface) private readonly favoritesService: FavoritesServiceInterface,
  ) {
    super(logger);

    this.logger.info('Register routes for FavoritesController...');
    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Post,
      handler: this.change,
      middlewares: [
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
        new AuthorizedMiddleware(),
        new ValidateDtoMiddleware(CreateCommentDto)
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
  }

  public async change(req: Request, res: Response) : Promise<void> {

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
    const comments = await this.commentService.findByOffer(offerId);
    this.ok(res, fillDTO(CommentRdo, comments));
  }
}
