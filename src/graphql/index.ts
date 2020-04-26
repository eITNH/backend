// General
import { Mutation } from './components/Mutation';
import { Query } from './components/Query';

import * as Category from './components/Category';
import * as User from './components/User';
import * as Course from './components/Course';
import * as File from './components/File';
import * as Utilities from './components/Utilities';
import * as Auth from './components/Auth';

// Scalars
import Upload from './scalars/Upload';
import DateTime from './scalars/DateTime';

export const resolvers = {
  Query,
  Mutation,

  Utilities,
  Auth,
  User,
  Course,
  Category,
  File,

  Upload,
  DateTime,
};
