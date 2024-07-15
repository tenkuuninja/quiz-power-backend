import {
  Body,
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guard';
import { UploadImageDto } from './dto/upload-image.dto';
import { UploadService } from './upload.service';

@Controller('upload')
@ApiTags('Quiz')
@ApiBearerAuth()
export class uploadController {
  constructor(private uploadService: UploadService) {}

  @Post('/file')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadImageDto,
  ) {
    console.log(file);
    return this.uploadService.uploadImage(file, body);
  }
}
