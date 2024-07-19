import { Body, Controller, Get, Post } from '@nestjs/common';
import { UrlService } from './url.service';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  shortener(@Body() list: any): String[] {
    return this.urlService.shortener(list.urlList);
  }
}
