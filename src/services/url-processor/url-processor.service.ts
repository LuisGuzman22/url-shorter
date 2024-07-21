import { Injectable, Logger } from '@nestjs/common';
import { UuidGeneratorService } from '../uuid-generator/uuid-generator.service';
import { CacheService } from '../../cache/cache.service';

@Injectable()
export class UrlProcessorService {
  private readonly logger = new Logger(UrlProcessorService.name);

  constructor(
    private readonly uuidGeneratorService: UuidGeneratorService,
    private readonly cacheService: CacheService,
  ) {}
  public async shortener(urlList: String[]): Promise<String[]> {
    const result = await Promise.all(
      urlList.map(async (url: string) => {
        if (this.validateUrl(url)) {
          return await this.mapUrlToId(url);
        }
        return 'invalid url';
      }),
    );
    return result;
  }

  public restoreUrl(key: string): Promise<string> {
    return this.cacheService.getValue(key);
  }

  public deleteUrl(key: string): Promise<void> {
    return this.cacheService.deleteValue(key);
  }

  private validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  }

  private generateUUID(): string {
    return this.uuidGeneratorService.generateUUID();
  }

  private async saveCache(key: string, value: string): Promise<boolean> {
    return await this.cacheService.setValue(key, value);
  }

  private async mapUrlToId(url: string): Promise<string> {
    const id = this.generateUUID();
    const registered = await this.saveCache(id, url);
    if (registered) {
      return this.generateUrl(id);
    } else {
      this.logger.error('url not processed');
      return 'not processed';
    }
  }

  private generateUrl(key: string): string {
    return `http://localhost:3000/url/restore/${key}`;
  }
}
