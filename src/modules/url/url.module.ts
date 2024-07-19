import { Module } from '@nestjs/common';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { ServicesModule } from 'src/services/services.module';

@Module({
  imports: [ServicesModule],
  controllers: [UrlController],
  providers: [UrlService],
})
export class UrlModule {}
