import { Injectable, Logger } from '@nestjs/common';
import { RegisterUrl } from 'src/application/dto/domain/register-url.dto';
import axios from 'axios';

@Injectable()
export class RegistrationService {
  private readonly logger = new Logger(RegistrationService.name);
  // counter = 0;
  // errorCounter = 0;
  constructor() {}

  async registerUrl(data: RegisterUrl): Promise<void> {
    try {
      // this.counter++;
      // this.logger.log(`counter: ${this.counter}`);
      const url = `http://localhost:3001/url`;

      await axios.post(url, data);
    } catch (error) {
      // this.errorCounter++;
      // this.logger.log(`errorCounter: ${this.errorCounter}`);
      this.logger.error('error on register url', error);
    }
  }
}
