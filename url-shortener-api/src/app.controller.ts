import { Controller, Get, Param, Res, HttpStatus, NotFoundException, Req } from '@nestjs/common';
import { Response, Request} from 'express';
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
  async redirect(@Param('slug') slug: string, @Req() req: Request, @Res() res: Response) {
    console.log("Redirecting to URL", slug);
    const ip = req.ip;                                  // Client IP (honors trust proxy)
    const referer = req.headers['referer'] || null;     // Referer header (spell‑checked per RFC)
    const userAgent = req.headers['user-agent'] || '';  // User‑Agent header

    const url = await this.urlService.visitUrl(slug, ip, userAgent, referer);
    if (!url) {
      throw new NotFoundException('URL not found');
    }
    return res.redirect(HttpStatus.FOUND, url.url);
  }
}
