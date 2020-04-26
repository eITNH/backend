import {
  createReadStream,
  createWriteStream,
  ReadStream,
  existsSync,
} from 'fs';
import { join } from 'path';
import { sync } from 'mkdirp';
import { createHash } from 'crypto';
import { FileUpload } from 'graphql-upload';

export default class UploadHandler {
  relativeFilesDirectory: string;
  hashAlgorithm: string;

  constructor() {
    this.relativeFilesDirectory = join(
      __dirname.replace(process.env.ROOT_DIR, ''),
      'files',
    );

    // Algorithm depends on availability of OpenSSL on platform
    // Another algorithms: 'sha1', 'md5', 'sha256', 'sha512'...
    this.hashAlgorithm = 'sha1';
  }

  async storeUpload(file: FileUpload): Promise<{ location: string } | null> {
    const fileHash = await this.generateFileHash(file);
    const filePath = fileHash.substring(0, 5).split('');
    const relativePath = join(this.relativeFilesDirectory, ...filePath);
    const absolutePath = join(process.env.ROOT_DIR, relativePath);
    return await new Promise((resolve, reject) => {
      sync(absolutePath);
      return file
        .createReadStream()
        .pipe(createWriteStream(join(absolutePath, file.filename)))
        .on('finish', () =>
          resolve({
            location: join(relativePath, file.filename),
          }),
        )
        .on('error', () => reject(null));
    });
  }

  generateFileHash(file: FileUpload): Promise<string> {
    const shasum = createHash(this.hashAlgorithm);
    const stream = file.createReadStream();

    return new Promise((resolve) => {
      stream.on('data', (chunk) => {
        shasum.update(chunk);
      });
      stream.on('end', function() {
        const hash = shasum.digest('hex');
        resolve(hash);
      });
    });
  }

  async saveFile(fileStream: Promise<FileUpload>): Promise<string | null> {
    const file = await fileStream;
    const { location } = await this.storeUpload(file);
    if (location) {
      return location;
    }
    return null;
  }

  getFile(path: string): ReadStream | null {
    const absolutePath = join(process.env.ROOT_DIR, path);
    if (existsSync(absolutePath)) {
      return createReadStream(absolutePath);
    }

    return null;
  }
}
