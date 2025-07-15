import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { VisitService } from './visit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from './entities/url.entity';
import { Visit } from './entities/visit.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Url, Visit]), AuthModule],
  controllers: [UrlController],
  providers: [UrlService, VisitService],
  exports: [UrlService, VisitService],
})
export class UrlModule {}
