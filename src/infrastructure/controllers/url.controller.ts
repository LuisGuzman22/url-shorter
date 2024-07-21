import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  Res,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UrlShortenerService } from '../../application/services/url-shortener.service';
import { CreateUrlDto } from '../../application/dto/request/create-url.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUrlResponseDto } from 'src/application/dto/response/create-url.response.dto';

@Controller('url')
export class UrlController {
  constructor(private readonly urlShortenerService: UrlShortenerService) {}

  @Post()
  async create(
    @Body() createUrlDto: CreateUrlDto,
  ): Promise<CreateUrlResponseDto[]> {
    return await this.urlShortenerService.shortenUrl(createUrlDto);
  }

  @Get(':shortUrl')
  async redirect(@Param('shortUrl') shortUrl: string, @Res() res) {
    return await this.urlShortenerService.getOriginalUrl(shortUrl, res);
  }

  @Delete('/:key')
  deleteUrl(@Param() params: any): Promise<void> {
    return this.urlShortenerService.deleteUrl(params.key);
  }

  @Post('masive')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file.buffer.toString());
  }
}
