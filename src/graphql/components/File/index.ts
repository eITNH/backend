import { objectType } from '@nexus/schema';

import FileById from './Queries/FileById';
import FilesByType from './Queries/FilesByType';

const File = objectType({
  name: 'File',
  definition(t) {
    t.model.id();
    t.string('downloadUrl', {
      resolve(file, _args, { request }) {
        return `${request.protocol}://${request.get('host')}/download/${
          file.id
        }`;
      },
    });
    t.model.title();
    t.model.type();
    t.model.size();
    t.model.path();
    t.model.createdAt();
    t.model.updatedAt();
    t.model.categories();
    t.model.creator();
  },
});

export {
  File,
  // Queries
  FileById,
  FilesByType,
  // Mutations
};
