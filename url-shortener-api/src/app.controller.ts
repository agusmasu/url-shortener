import { Controller, Get, Param, Res, HttpStatus, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { UrlService } from './url/url.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly urlService: UrlService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get(':slug')
  async redirect(@Param('slug') slug: string, @Res() res: Response) {
    console.log("Redirecting to URL", slug);
    const url = await this.urlService.findBySlug(slug);
    if (!url) {
      throw new NotFoundException('URL not found');
    }
    return res.redirect(HttpStatus.FOUND, url.url);
  }
}
