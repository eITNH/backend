import { extendType, intArg } from '@nexus/schema';

export default extendType({
  type: 'Query',
  definition: (t) => {
    t.field('userById', {
      type: 'User',
      nullable: true,
      args: { id: intArg({ required: true }) },
      resolve(_root, { id }, ctx) {
        return ctx.db.user.findOne({
          where: { id },
        });
      },
    });
  },
});
