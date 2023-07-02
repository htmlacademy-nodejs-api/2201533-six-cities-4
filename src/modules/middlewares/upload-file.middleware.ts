import {MiddlewareInterface} from '../../types/middleware.interface.js';
import {NextFunction, Request, Response} from 'express';
import multer, {diskStorage} from 'multer';
import {nanoid} from 'nanoid';
import mime from 'mime';
import {mimeTypes} from '../consts.js';

export class UploadFileMiddleware implements MiddlewareInterface {
  constructor(
    private uploadDirectory: string,
    private fieldName: string,
  ) {}

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!mimeTypes.includes(mime.lookup(req.file?.filename as string))) {
      return;
    }
    const storage = diskStorage({
      destination: this.uploadDirectory,
      filename: (_req, file, callback) => {
        const extension = mime.extension(file.mimetype);
        const filename = nanoid();
        callback(null, `${filename}.${extension}`);
      }
    });
    const uploadSingleFileMiddleware = multer({storage})
      .single(this.fieldName);// .any();
    uploadSingleFileMiddleware(req, res, next);
  }
}
