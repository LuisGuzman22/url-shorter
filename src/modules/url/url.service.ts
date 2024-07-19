import { BadRequestException, Injectable } from '@nestjs/common';
import { UrlProcessorService } from 'src/services/url-processor/url-processor.service';

@Injectable()
export class UrlService {
  constructor(private readonly urlProcessorService: UrlProcessorService) {}
  shortener(urlList: String[]): String[] {
    if (!urlList || urlList.length === 0)
      throw new BadRequestException('urlList is required');

    return this.urlProcessorService.shortener(urlList);
  }
}
