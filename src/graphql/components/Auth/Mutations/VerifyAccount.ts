import { extendType, stringArg } from '@nexus/schema';

export default extendType({
  type: 'Mutation',
  definition: (t) => {
    t.boolean('verifyAccount', {
      args: {
        token: stringArg({ required: true }),
      },
      async resolve(_root, { token }, ctx) {
        const updatedAuths = await ctx.db.auth.updateMany({
          where: {
            verificationToken: token,
          },
          data: {
            activated: true,
            verificationToken: null,
          },
        });

        if (updatedAuths && updatedAuths.count > 0) {
          return true;
        }
        return false;
      },
    });
  },
});
