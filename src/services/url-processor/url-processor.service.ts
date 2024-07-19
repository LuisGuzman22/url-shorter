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
    return urlList.map((url: string) => {
      return this.mapUrlToId(url);
    });
  }

  public restoreUrl(key: string): Promise<string> {
    return this.cacheService.getValue(key);
  }

  public deleteUrl(key: string): Promise<void> {
    return this.cacheService.deleteValue(key);
  }

  private generateUUID(): string {
    return this.uuidGeneratorService.generateUUID();
  }

  private saveCache(key: string, value: string): void {
    this.cacheService.setValue(key, value);
  }

  private mapUrlToId(url: string): string {
    const id = this.generateUUID();
    this.saveCache(id, url);
    return this.generateUrl(id);
  }

  private generateUrl(key: string): string {
    return `http://localhost:3000/url/restore/${key}`;
  }
}
