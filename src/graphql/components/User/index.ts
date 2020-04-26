import { objectType, enumType } from '@nexus/schema';

import Me from './Queries/Me';
import UserById from './Queries/UserById';
import Users from './Queries/Users';

const UserType = enumType({
  name: 'UserType',
  members: ['STUDENT', 'PROFESSOR'],
});

const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id();
    t.model.firstname();
    t.model.lastname();
    t.model.image();
    t.model.studentId();
    t.model.createdAt();
    t.model.type();
    t.model.updatedAt();
    t.model.courses();
    t.model.favoriteCourses();
    t.model.files();
    t.string('username', {
      async resolve(user, _args, ctx) {
        const auth = await ctx.db.auth.findMany({
          where: {
            userId: user.id,
          },
        });

        if (auth && auth.length > 0) {
          return auth[0].username;
        }

        return '';
      },
    });
    t.string('email', {
      async resolve(user, _args, ctx) {
        const auth = await ctx.db.auth.findMany({
          where: {
            userId: user.id,
          },
        });

        if (auth && auth.length > 0) {
          return auth[0].email;
        }

        return '';
      },
    });
  },
});

export {
  User,
  UserType,
  // Queries
  Me,
  UserById,
  Users,
  // Mutations
};
