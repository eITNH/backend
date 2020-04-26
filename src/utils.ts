import { readFileSync } from 'fs';
import { join } from 'path';
import { verify } from 'jsonwebtoken';
import { Request } from 'express';

const APP_SECRET = readFileSync(join(__dirname, 'auth/secret.key'));

export interface IToken {
  authId: number;
  id: number;
  email: string;
  username: string;
  iat: number;
  exp: number;
}

export function getTokenParams(request: Request): IToken | null {
  const Authorization = request.get('Authorization');
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    let verifiedToken;
    try {
      verifiedToken = verify(token, APP_SECRET) as IToken;
    } catch (e) {
      verifiedToken = null;
    }
    return verifiedToken;
  }
}
