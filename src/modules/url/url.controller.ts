import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  Delete,
} from '@nestjs/common';
import { UrlService } from './url.service';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  shortener(@Body() list: any): String[] {
    return this.urlService.shortener(list.urlList);
  }

  @Get('/restore/:key')
  restoreUrl(@Param() params: any, @Res() res): Promise<void> {
    return this.urlService.restoreUrl(params.key, res);
  }

  @Delete('/delete/:key')
  deleteUrl(@Param() params: any): Promise<void> {
    return this.urlService.deleteUrl(params.key);
  }
}
