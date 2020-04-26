import { extendType, intArg } from '@nexus/schema';

export default extendType({
  type: 'Query',
  definition: (t) => {
    t.field('categoryById', {
      type: 'Category',
      nullable: true,
      args: { id: intArg({ required: true }) },
      resolve(_, { id }, ctx) {
        return ctx.db.category.findOne({
          where: { id },
        });
      },
    });
  },
});
