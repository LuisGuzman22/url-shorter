import { Injectable, Logger } from '@nestjs/common';
import { UuidGeneratorService } from './uuid-generator.service';
import { CacheService } from './cache.service';
import {
  ACTION_CREATE,
  INVALID_URL,
  ACTION_ACCESS,
  ACTION_DELETE,
  NOT_PROCESSED,
} from '../../constants/index';
import { RegistrationService } from '../../core/services/registration-service/registration-service.service';
import {
  CreateUrlResponseDto,
  ShortUrl,
} from '../dto/response/create-url.response.dto';

@Injectable()
export class UrlProcessService {
  private readonly logger = new Logger(UrlProcessService.name);

  constructor(
    private readonly uuidGeneratorService: UuidGeneratorService,
    private readonly cacheService: CacheService,
    private readonly registrationService: RegistrationService,
  ) {}

  public async shortener(urlList: string[]): Promise<CreateUrlResponseDto> {
    const shortList = await Promise.all(
      urlList.map((url) => this.processUrl(url)),
    );
    return { shortList };
  }

  private async processUrl(url: string): Promise<ShortUrl> {
    if (this.validateUrl(url)) {
      const id = await this.mapUrlToId(url);
      await this.registerUrl({
        shortUrl: id,
        originalUrl: url,
        action: ACTION_CREATE,
      });
      return this.createUrlResponse(id, url);
    }
    return this.createInvalidUrlResponse(url);
  }

  private createUrlResponse(shortUrl: string, longUrl: string): ShortUrl {
    return {
      shortUrl,
      longUrl,
    };
  }

  private createInvalidUrlResponse(longUrl: string): ShortUrl {
    return {
      shortUrl: INVALID_URL,
      longUrl,
    };
  }

  public async restoreUrl(key: string): Promise<string> {
    const originalUrl = await this.cacheService.getValue(key);
    await this.registerUrl({
      shortUrl: key,
      originalUrl: originalUrl,
      action: ACTION_ACCESS,
    });
    return originalUrl;
  }

  public async deleteUrl(key: string): Promise<void> {
    await this.registerUrl({
      shortUrl: key,
      action: ACTION_DELETE,
    });
    await this.cacheService.deleteValue(key);
  }

  private validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  }

  private async registerUrl(registerData: {
    shortUrl: string;
    originalUrl?: string;
    action: string;
  }): Promise<void> {
    await this.registrationService.registerUrl(registerData);
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
      return NOT_PROCESSED;
    }
  }

  private generateUrl(key: string): string {
    return `http://localhost:3000/url/${key}`;
  }
}
