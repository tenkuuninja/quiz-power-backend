import { Module } from '@nestjs/common';
import { uploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  controllers: [uploadController],
  providers: [UploadService],
})
export class UploadModule {}
