import { extendType, intArg } from '@nexus/schema';

export default extendType({
  type: 'Query',
  definition: (t) => {
    t.field('courseById', {
      type: 'Course',
      nullable: true,
      args: { id: intArg({ required: true }) },
      resolve(_root, { id }, ctx) {
        return ctx.db.course.findOne({
          where: { id },
        });
      },
    });
  },
});
