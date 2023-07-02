import {Request} from 'express';
import {UserTokenType} from '../../../types/user-token.type.js';
import {jwtVerify} from 'jose';
import {createSecretKey} from 'node:crypto';
import {UserServiceInterface} from '../../user/user-service.interface.js';

export async function ejectUser(req: Request, jwtSecret: string, userService: UserServiceInterface) : Promise<UserTokenType | null> {
  const authorizationHeader = req.headers?.authorization?.split(' ');
  if (!authorizationHeader) {
    return null;
  }
  const [, token] = authorizationHeader;

  try {
    const { payload } = await jwtVerify(
      token,
      createSecretKey(jwtSecret, 'utf-8')
    );
    const isGood = await userService.verifyToken(payload.id as string);
    if (isGood) {
      return payload as UserTokenType;
    } else {
      return null;
    }
  } catch {
    return null;
  }
}
