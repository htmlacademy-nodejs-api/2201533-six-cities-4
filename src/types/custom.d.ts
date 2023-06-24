import {UserTokenType} from './user-token.type.js';

declare namespace Express {
  export interface Request {
    user: UserTokenType;
  }
}
