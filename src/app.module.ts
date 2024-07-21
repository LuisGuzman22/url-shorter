import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UrlModule } from './modules/url/url.module';
import { ServicesModule } from './services/services.module';
import { CacheModule } from './cache/cache.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlEntity } from './entities/url.entity';

@Module({
  imports: [
    UrlModule,
    ServicesModule,
    CacheModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'myuser',
      password: 'mypassword',
      database: 'mydatabase',
      entities: [UrlEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([UrlEntity]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
