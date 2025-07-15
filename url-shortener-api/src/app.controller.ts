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

  @Get(':slug')
  async redirect(@Param('slug') slug: string, @Req() req: Request, @Res() res: Response) {
    // First, we get the information about the visit:
    const ip = req.ip;
    const referer = req.headers['referer'] || null;
    const userAgent = req.headers['user-agent'] || '';
    
    const frontendBaseUrl = process.env.CLIENT_BASE_URL || 'http://localhost:3000';
    try {
      // Then, we record the visit:
      const url = await this.urlService.visitUrl(slug, ip, userAgent, referer);
      
      // Finally, we redirect to the URL:
      return res.redirect(url.url);
    } catch (err) {
      if (err instanceof NotFoundException) {
        // If the URL is not found, we redirect to our not-found page:
        return res.redirect(`${frontendBaseUrl}/not-found`);
      }

      // TODO We could potentially redirect to a generic error page here
      throw err;
    }
  }
}
