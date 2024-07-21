import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UrlProcessorService } from '../../services/url-processor/url-processor.service';

@Injectable()
export class UrlService {
  private readonly logger = new Logger(UrlService.name);

  constructor(private readonly urlProcessorService: UrlProcessorService) {}
  public async shortener(urlList: String[]): Promise<String[]> {
    this.logger.log('shortening url list');
    if (!urlList || urlList.length === 0) {
      this.logger.error('urlList is required');
      throw new BadRequestException('urlList is required');
    }
    return await this.urlProcessorService.shortener(urlList);
  }

  public async restoreUrl(key: string, res: any): Promise<void> {
    this.logger.log('restoring url');
    const longUrl = await this.urlProcessorService
      .restoreUrl(key)
      .then((url) => {
        return url;
      });
    if (!longUrl) {
      this.logger.error('key not found');
      throw new NotFoundException('key not found');
    }
    res.redirect(longUrl);
  }

  public async deleteUrl(key: string): Promise<void> {
    this.logger.log('deleting url');
    await this.urlProcessorService.deleteUrl(key);
  }
}
