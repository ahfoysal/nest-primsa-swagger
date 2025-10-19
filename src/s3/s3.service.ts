import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export class S3Service {
  private s3: S3Client;
  private AWS_S3_BUCKET_NAME: string;
  private AWS_REGION: string;

  constructor() {
    if (!process.env.AWS_REGION) throw new Error('AWS_REGION is not defined');
    if (!process.env.AWS_S3_BUCKET_NAME)
      throw new Error('AWS_S3_BUCKET_NAME is not defined');
    if (!process.env.AWS_ACCESS_KEY_ID)
      throw new Error('AWS_ACCESS_KEY_ID is not defined');
    if (!process.env.AWS_SECRET_ACCESS_KEY)
      throw new Error('AWS_SECRET_ACCESS_KEY is not defined');

    this.AWS_REGION = process.env.AWS_REGION;
    this.AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

    this.s3 = new S3Client({
      region: this.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async uploadFiles<T extends string>(
    files: Express.Multer.File[],
  ): Promise<T[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No file(s) uploaded');
    }

    if (files.length > 20) {
      throw new BadRequestException('You can upload a maximum of 20 files');
    }

    const results: string[] = [];

    for (const file of files) {
      results.push(await this.uploadFile(file));
    }

    return results as T[];
  }

  async uploadFile<T extends string>(file: Express.Multer.File): Promise<T> {
    const fileExt = file.originalname.split('.').pop();
    const folder = this.getFolderByMimeType(file.mimetype);
    const uniqueFileName = `${uuidv4()}.${fileExt}`;
    const s3Key = `${folder}/${uniqueFileName}`;

    try {
      const command = new PutObjectCommand({
        Bucket: this.AWS_S3_BUCKET_NAME,
        Key: s3Key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.s3.send(command);

      const fileUrl = `https://${this.AWS_S3_BUCKET_NAME}.s3.${this.AWS_REGION}.amazonaws.com/${s3Key}`;

      return fileUrl as T;
    } catch (err) {
      console.error('S3 upload error:', err);
      throw new BadRequestException('Failed to upload file to S3');
    }
  }

  private getFolderByMimeType(mimeType: string): string {
    if (mimeType.startsWith('image/')) return 'images';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.startsWith('video/')) return 'videos';
    return 'documents';
  }
}
