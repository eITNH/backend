import { extendType, stringArg } from '@nexus/schema';

export default extendType({
  type: 'Query',
  definition: (t) => {
    t.list.field('filesByType', {
      type: 'File',
      args: { type: stringArg({ required: true }) },
      resolve(_file, { type }, ctx) {
        return ctx.db.file.findMany({
          where: { type },
        });
      },
    });
  },
});
