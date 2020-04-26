import { extendType, inputObjectType } from '@nexus/schema';

export default extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('addFavorite', {
      type: 'Course',
      args: {
        data: inputObjectType({
          name: 'AddFavoriteInput',
          definition(t) {
            t.int('courseId', { required: true });
          },
        }),
      },
      resolve(_root, { data }, ctx) {
        const { courseId } = data;

        return ctx.db.course.update({
          where: {
            id: courseId,
          },
          data: {
            likers: {
              connect: {
                id: ctx.viewer.id,
              },
            },
          },
        });
      },
    });
  },
});
