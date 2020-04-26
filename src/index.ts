import './bootstrap';
import { nexusPrismaPlugin } from 'nexus-prisma';
import { PrismaClient } from '@prisma/client';
import { makeSchema } from '@nexus/schema';
import { ApolloServer } from 'apollo-server-express';
import { join } from 'path';
import cors from 'cors';
import express from 'express';

// import { permissions } from './auth';
import * as types from './graphql';
import { Context } from './types';
import { getTokenParams } from './utils';

const client = new PrismaClient();

const schema = makeSchema({
  types,
  plugins: [
    nexusPrismaPlugin({
      prismaClient: () => client,
    }),
  ],
  shouldGenerateArtifacts: true,
  outputs: {
    typegen: join(__dirname, '../generated/nexus-typegen.ts'),
    schema: join(__dirname, '/schema.graphql'),
  },
  typegenAutoConfig: {
    sources: [
      {
        source: '@prisma/client',
        alias: 'db',
      },
      {
        source: join(__dirname, 'types.ts'),
        alias: 'ctx',
      },
    ],
    contextType: 'ctx.Context',
  },
});

const server = new ApolloServer({
  schema,
  context: (ctx) => {
    return {
      viewer: getTokenParams(ctx.req),
      request: ctx.req,
      db: client,
    };
  },
  playground: process.env.NODE_ENV === 'development',
  debug: process.env.NODE_ENV === 'development',
});

const app = express();

app.use('/upload/files', express.static(join(__dirname, 'upload/files')));

app.use(
  '*',
  cors({
    origin: '*',
    methods: 'GET,POST',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }),
);

server.applyMiddleware({ app });

app.listen(
  {
    port: process.env.PORT || 8081,
  },
  () => {
    console.log(
      `🚀 Server ready at: http://localhost:${process.env.PORT || 8081} in ${
        process.env.NODE_ENV
      } mode`,
    );
  },
);
