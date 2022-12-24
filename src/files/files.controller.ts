import { Controller, Get, Post,  Param, UploadedFile, UseInterceptors, BadRequestException, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { createReadStream } from 'fs';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers';




@Controller('files')
@ApiTags("Files")
export class FilesController {
  constructor(private readonly filesService: FilesService,private configService:ConfigService) { }


  @Get('product/:imageName')
  findProductImage(@Param('imageName') imageName: string) {
    console.log(imageName);
    const path= this.filesService.getStaticProductImage(imageName);
    const stream = createReadStream(path);
    return new StreamableFile(stream);

  }

  @UseInterceptors(FileInterceptor("file", {
    fileFilter, storage: diskStorage({
      destination: './static/products', filename: fileNamer
    })
    //limits:{fieldSize:1000}
  }))
  @Post('product')
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("Asegurate de incluir una imagen")
    }
    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`
    return { secureUrl };
  }

}
