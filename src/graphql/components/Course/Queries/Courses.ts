import { extendType } from '@nexus/schema';

export default extendType({
  type: 'Query',
  definition: (t) => {
    t.list.field('courses', {
      type: 'Course',
      resolve(_root, _args, ctx) {
        return ctx.db.course.findMany();
      },
    });
  },
});
