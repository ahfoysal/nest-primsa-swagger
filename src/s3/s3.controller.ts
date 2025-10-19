import {
  BadRequestException,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import * as multer from 'multer';

import { apiBodyExample } from './example';
import { S3Service } from './s3.service';
import { S3ResponseDto } from './dto/s3.dto';

@ApiTags('AWS S3 Uploads')
@Controller('aws-uploads')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post()
  @ApiOperation({ summary: 'Upload multiple OR single file files to S3' })
  @ApiConsumes('multipart/form-data')
  @ApiBody(apiBodyExample)
  @ApiResponse({ status: 201, type: S3ResponseDto, isArray: true })
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: multer.memoryStorage(),
      limits: { files: 20 }, // TODO: based on the cap level it will be incress and dicress
    }),
  )
  async upload(@UploadedFiles() files: Array<Express.Multer.File>) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No file(s) uploaded');
    }

    if (files.length > 20) {
      throw new BadRequestException('You can upload a maximum of 20 files');
    }

    return this.s3Service.uploadFiles(files);
  }
}
