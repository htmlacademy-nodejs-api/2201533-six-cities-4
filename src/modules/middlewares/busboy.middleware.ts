import {MiddlewareInterface} from '../../types/middleware.interface.js';
import {NextFunction, Request, Response} from 'express';
import busboy from 'busboy';
import path from 'node:path';
import {nanoid} from 'nanoid';
import mime from 'mime';
import * as fs from 'node:fs';

export class BusboyMiddleware implements MiddlewareInterface {
  private obj = {};
  private files: {[p: string]: string[]};
  constructor(
    private uploadDirectory: string,
    private fieldNames: string[],
    private jsonFieldName: string
  ) {
    this.files = Object.fromEntries(Array.from(fieldNames, (name) => [name, []]));
  }

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    console.log('BusboyMiddleware');
    const bb = busboy({headers: req.headers});
    bb.on('file', (name, file, info) => {
      if (this.fieldNames.includes(name)) {
        const filename = `${nanoid()}.${mime.extension(info.mimeType)}`;
        const saveTo = path.join(
          this.uploadDirectory,
          filename);
        file.pipe(fs.createWriteStream(saveTo));
        this.files[name].push(filename);
      }
    });
    bb.on('field', (name, val, _info) => {
      if (name === this.jsonFieldName) {
        this.obj = JSON.parse(val);
        console.log(`Field [${name}]: value: %j`, val);
        console.log(this.obj);
      }
    });
    bb.on('close', () => {
      this.obj = Object.assign(this.obj, this.files);
      console.log(this.obj);
      console.log('Done parsing form!');
    });
    await req.pipe(bb);
    next();
  }
}
