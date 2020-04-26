import { extendType, stringArg } from '@nexus/schema';

export default extendType({
  type: 'Query',
  definition: (t) => {
    t.list.field('categoriesByType', {
      type: 'Category',
      args: { type: stringArg({ required: true }) },
      resolve(_, { type }, ctx) {
        return ctx.db.category.findMany({
          where: { type },
        });
      },
    });
  },
});
