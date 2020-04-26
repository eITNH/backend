import { extendType } from '@nexus/schema';

export default extendType({
  type: 'Query',
  definition: (t) => {
    t.list.field('users', {
      type: 'User',
      resolve(_root, _args, ctx) {
        return ctx.db.user.findMany();
      },
    });
  },
});
