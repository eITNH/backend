import { extendType, inputObjectType } from '@nexus/schema';

export default extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('removeFavorite', {
      type: 'Course',
      args: {
        data: inputObjectType({
          name: 'RemoveFavoriteInput',
          definition(t) {
            t.int('courseId', { required: true });
          },
        }),
      },
      async resolve(_root, { data }, ctx) {
        const { courseId } = data;

        return ctx.db.course.update({
          where: {
            id: courseId,
          },
          data: {
            likers: {
              disconnect: {
                id: ctx.viewer.id,
              },
            },
          },
        });
      },
    });
  },
});
