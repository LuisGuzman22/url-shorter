import { Injectable } from '@nestjs/common';
import { UuidGeneratorService } from '../uuid-generator/uuid-generator.service';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class UrlProcessorService {
  constructor(
    private readonly uuidGeneratorService: UuidGeneratorService,
    private readonly cacheService: CacheService,
  ) {}
  public shortener(urlList: String[]): String[] {
    const urlShorterList: String[] = [];
    urlList.forEach((url: string) => {
      const id = this.generateUUID();
      urlShorterList.push(id);
      this.saveCache(id, url);
    });
    return urlShorterList;
  }

  private generateUUID(): string {
    return this.uuidGeneratorService.generateUUID();
  }

  private saveCache(key: string, value: string): void {
    this.cacheService.setValue(key, value);
  }
}
