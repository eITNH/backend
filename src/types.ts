import { PrismaClient } from '@prisma/client';
import { Request } from 'express';
import { IToken } from './utils';

export interface Context {
  db: PrismaClient;
  request: Request;
  viewer?: IToken;
}
