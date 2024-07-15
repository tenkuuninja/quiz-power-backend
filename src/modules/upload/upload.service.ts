import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadImageDto } from './dto/upload-image.dto';

cloudinary.config({
  cloud_name: process.env['CLOUDINARY_NAME'],
  api_key: process.env['CLOUDINARY_API_KEY'],
  api_secret: process.env['CLOUDINARY_API_SECRECT'],
  secure: true,
});

@Injectable()
export class UploadService {
  async uploadImage(file: Express.Multer.File, dto: UploadImageDto) {
    console.log(file, dto);
    const byteArrayBuffer = await file.buffer;

    const base64Data = Buffer.from(byteArrayBuffer).toString('base64');
    const base64URI = `data:${file.mimetype};base64,${base64Data}`;

    const result = await cloudinary.uploader.upload(base64URI, {
      resource_type: 'image',
      public_id: dto?.path + '/' + crypto.randomUUID(),
    });

    return { url: result?.secure_url };
  }
}
