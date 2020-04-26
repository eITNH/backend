import { extendType, arg } from '@nexus/schema';
import { FileUpload } from 'graphql-upload';
import UploadHandler from '../../../../upload';

export default extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('upload', {
      type: 'String',
      nullable: true,
      args: {
        file: arg({ type: 'Upload', required: true }),
      },
      async resolve(_root, { file }: { file: Promise<FileUpload> }, ctx) {
        const uploadHandler = new UploadHandler();
        return uploadHandler.saveFile(file);
      },
    });
  },
});
