import {MiddlewareInterface} from '../../types/middleware.interface';
import {NextFunction, Request, Response} from 'express';
import HttpError from '../../core/errors/http-error.js';
import {StatusCodes} from 'http-status-codes';

export class ShowRaw implements MiddlewareInterface {

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    let contentType: string | undefined;
    let boundary: string | undefined;
    try {
      contentType = req.headers['content-type'];
      boundary = contentType?.substring(contentType?.indexOf('boundary=') + 9);
    } catch (_) {
      return next(new HttpError(
        StatusCodes.BAD_REQUEST,
        'The media type is not multipart/form-data',
        'ShowRaw')
      );
    }

    const parts: string[] = req.body.split(`--${boundary}`);
    // console.log(parts);
    parts.filter((part) => !(part === '' || part === '--')).forEach((part, index) => {
      const headers = Object.fromEntries(
        part.substring(0, part.indexOf('\r\n\r\n')).split('\r\n')
          .filter((row) => row !== '').map((row) => row.split(':')));

      console.log(index, headers);
      // console.log(index, part);
    });

    // console.log(parts);

    // console.log(contentType);
    // console.log(boundary);
    // console.log(req.body);

    return next();
  }
}
