import {MiddlewareInterface} from '../../types/middleware.interface.js';
import {NextFunction, Request, Response} from 'express';
import busboy from 'busboy';
import path from 'node:path';
import {nanoid} from 'nanoid';
import mime from 'mime';
import {createWriteStream} from 'node:fs';
import {ClassConstructor, plainToInstance} from 'class-transformer';
import {mimeTypes} from '../consts.js';

export class BusboyMiddleware<RDO> implements MiddlewareInterface {
  private obj = {};
  private files: {[p: string]: string[]};
  private fieldNames: string[];
  private readonly count: { [x: string]: number; };
  constructor(
    private uploadDirectory: string,
    fields: {[p: string]: number},
    private jsonFieldName: string,
    private rdo: ClassConstructor<RDO>
  ) {
    this.fieldNames = Object.keys(fields);
    this.files = {};
    this.count = Object.assign({}, fields);
  }

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const filePromises: Promise<void>[] = [];
    const bb = busboy({headers: req.headers});
    res.locals.files = [];
    bb.on('file', (nameFull, file, info) => {
      const name = nameFull.indexOf('[') === -1 ? nameFull : nameFull.substring(0, nameFull.indexOf('['));
      if (this.fieldNames.includes(name) && mimeTypes.includes(mime.lookup(info.filename)) && this.count[name] > 0) {
        if (!Object.keys(this.files).includes(name)){
          this.files[name] = [];
        }
        const filename = `${nanoid()}.${mime.extension(info.mimeType)}`;
        const saveTo = path.join(
          this.uploadDirectory,
          filename);
        filePromises.push(new Promise((resolve, reject) => {
          const writeStream = createWriteStream(saveTo)
            .on('error', reject)
            .on('finish', resolve);
          file.on('error', reject);
          file.pipe(writeStream);
          this.files[name].push(filename);
          res.locals.files.push(saveTo);
        }));
        this.count[name] --;
      } else {
        file.resume();
      }
    });
    bb.on('field', (name, val, _info) => {
      if (name === this.jsonFieldName) {
        this.obj = JSON.parse(val);
      }
    });
    bb.on('close', () => {
      filePromises.forEach((promise) => promise);
      console.log('BusboyMiddleware files:', this.files);
      req.body = plainToInstance(this.rdo, Object.assign(this.obj, this.files));
      this.files = {};
      next();
    });
    await req.pipe(bb);
  }
}
