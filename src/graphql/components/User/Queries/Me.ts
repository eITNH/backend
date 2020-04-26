import { extendType } from '@nexus/schema';

export default extendType({
  type: 'Query',
  definition: (t) => {
    t.field('me', {
      type: 'User',
      nullable: true,
      resolve(_root, _args, ctx) {
        if (!ctx.viewer || !ctx.viewer.id) {
          return null;
        }

        return ctx.db.user.findOne({
          where: {
            id: ctx.viewer.id,
          },
        });
      },
    });
  },
});
