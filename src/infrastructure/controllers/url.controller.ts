import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Res,
  Delete,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseFilePipeBuilder } from '@nestjs/common/pipes';
import { CreateUrlDto } from 'src/application/dto/request/create-url.dto';
import { CreateUrlResponseDto } from 'src/application/dto/response/create-url.response.dto';
import { UrlShortenerService } from 'src/application/services/url-shortener.service';

@ApiTags('url')
@Controller('url')
export class UrlController {
  constructor(private readonly urlShortenerService: UrlShortenerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a shortened URL' })
  @ApiResponse({ status: 201, description: 'URL successfully shortened.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async create(
    @Body() createUrlDto: CreateUrlDto,
  ): Promise<CreateUrlResponseDto[]> {
    return await this.urlShortenerService.shortenUrl(createUrlDto);
  }

  @Get(':shortUrl')
  @ApiOperation({ summary: 'Redirect to the original URL' })
  @ApiParam({
    name: 'shortUrl',
    required: true,
    description: 'The shortened URL key',
  })
  @ApiResponse({ status: 302, description: 'Redirection successful.' })
  @ApiResponse({ status: 404, description: 'URL not found.' })
  async redirect(@Param('shortUrl') shortUrl: string, @Res() res) {
    return await this.urlShortenerService.getOriginalUrl(shortUrl, res);
  }

  @Delete('/:key')
  @ApiOperation({ summary: 'Delete a shortened URL' })
  @ApiParam({
    name: 'key',
    required: true,
    description: 'The key of the shortened URL to delete',
  })
  @ApiResponse({ status: 204, description: 'URL successfully deleted.' })
  @ApiResponse({ status: 404, description: 'URL not found.' })
  deleteUrl(@Param() params: any): Promise<void> {
    return this.urlShortenerService.deleteUrl(params.key);
  }

  @Post('masive')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a file for mass URL shortening' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'CSV file containing URLs to be shortened',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'File processed successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid file format or size.' })
  uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'csv',
        })
        .addMaxSizeValidator({
          maxSize: 1024,
        })
        .build({
          exceptionFactory(error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
          },
        }),
    )
    file: Express.Multer.File,
  ) {
    return this.urlShortenerService.masiveUpload(file);
  }
}
