import { Module } from '@nestjs/common';
import { UrlProcessorService } from './url-processor/url-processor.service';
import { UuidGeneratorService } from './uuid-generator/uuid-generator.service';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [CacheModule],
  providers: [UrlProcessorService, UuidGeneratorService],
  exports: [UrlProcessorService, UuidGeneratorService],
})
export class ServicesModule {}
