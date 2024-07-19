import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';

@Injectable()
export class UuidGeneratorService {
  public generateUUID(): string {
    return nanoid(6);
  }
}
