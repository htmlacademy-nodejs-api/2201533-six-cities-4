import * as jose from 'jose';
import * as crypto from 'node:crypto';

export async function createJWT(algorithm: string, jwtSecret: string, payload: object, id: string): Promise<string> {
  return new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: algorithm })
    .setIssuedAt()
    .setExpirationTime('2d')
    .setJti(id)
    .sign(crypto.createSecretKey(jwtSecret, 'utf-8'));
}
