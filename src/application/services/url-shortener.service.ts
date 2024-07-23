import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUrlDto } from '../dto/request/create-url.dto';
import { CreateUrlResponseDto } from '../dto/response/create-url.response.dto';
import { UrlProcessService } from './url-process.service';

@Injectable()
export class UrlShortenerService {
  private readonly logger = new Logger(UrlShortenerService.name);

  constructor(private readonly urlProcessService: UrlProcessService) {}

  public async shortenUrl(
    createUrlDto: CreateUrlDto,
  ): Promise<CreateUrlResponseDto> {
    this.logger.log('shortening url list');
    if (!createUrlDto.urlList || createUrlDto.urlList.length === 0) {
      this.logger.error('urlList is required');
      throw new BadRequestException('urlList is required');
    }

    return this.urlProcessService.shortener(createUrlDto.urlList);
  }

  public async getOriginalUrl(key: string, res: any): Promise<void> {
    this.logger.log('restoring url');
    const longUrl = await this.urlProcessService.restoreUrl(key);

    if (!longUrl) {
      this.logger.error('key not found');
      throw new NotFoundException('key not found');
    }
    res.redirect(longUrl);
  }

  public async deleteUrl(key: string): Promise<void> {
    this.logger.log('deleting url');
    await this.urlProcessService.deleteUrl(key);
  }

  public async masiveUpload(file: Express.Multer.File) {
    this.logger.log('masive upload');

    const lines = file.buffer.toString().split('\n');
    const urlList = [];

    lines.map((line) => {
      const urls = line.split(';');
      urls.map((item) => {
        const url = this.trimUrl(item);
        if (url) urlList.push(url);
      });
    });

    return this.urlProcessService.shortener(urlList);
  }

  private trimUrl(url: string): string {
    const trimmedItem = url.replace(/\r/g, '').trim();
    if (!!trimmedItem) {
      return trimmedItem;
    }
  }
}
