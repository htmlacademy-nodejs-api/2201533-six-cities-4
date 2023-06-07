import {MiddlewareInterface} from '../../types/middleware.interface.js';
import {NextFunction, Response, Request} from 'express';
import {jwtVerify} from 'jose';
import {createSecretKey} from 'node:crypto';
import HttpError from '../../core/errors/http-error.js';
import {StatusCodes} from 'http-status-codes';
import {UserTokenType} from '../../types/user-token.type.js';

export class AuthenticateMiddleware implements MiddlewareInterface {
  constructor(private readonly jwtSecret: string) {}

  private async ejectUser(req: Request) : Promise<UserTokenType | null> {
    const authorizationHeader = req.headers?.authorization?.split(' ');
    if (!authorizationHeader) {
      return null;
    }
    const [, token] = authorizationHeader;

    try {
      const { payload } = await jwtVerify(
        token,
        createSecretKey(this.jwtSecret, 'utf-8')
      );
      return payload as UserTokenType;
    } catch {

      return null;
    }
  }

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const authorizationHeader = req.headers?.authorization?.split(' ');
    if (!authorizationHeader) {
      return next();
    }

    const [, token] = authorizationHeader;

    try {
      const { payload } = await jwtVerify(
        token,
        createSecretKey(this.jwtSecret, 'utf-8')
      );

      req.user = { email: payload.email as string, id: payload.id as string };
      return next();
    } catch {

      return next(new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'AuthenticateMiddleware')
      );
    }
    const user = this.ejectUser(req);
    if (user) {
      req.user = user;
      return n
    }

  }
}
