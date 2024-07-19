import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UrlModule } from './modules/url/url.module';
import { UrlProcessorService } from './services/url-processor/url-processor.service';
import { ServicesModule } from './services/services.module';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [UrlModule, ServicesModule, CacheModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
