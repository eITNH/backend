import { extendType } from '@nexus/schema';

export default extendType({
  type: 'Query',
  definition: (t) => {
    t.boolean('isLoggedIn', {
      resolve(_root, _args, ctx) {
        if (ctx.viewer && ctx.viewer.id) {
          return true;
        }
        return false;
      },
    });
  },
});
