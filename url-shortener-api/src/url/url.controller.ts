import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, NotFoundException, Req, Query, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { UrlService } from './url.service';
import { VisitService } from './visit.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('admin/url')
export class UrlController {
  constructor(
    private readonly urlService: UrlService,
    private readonly visitService: VisitService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createUrlDto: CreateUrlDto, @Req() req: Request) {
    const user = (req as any).user;
    return this.urlService.create(createUrlDto, user);
  }

  @Get('list')
  @UseGuards(AuthGuard)
  findAll(@Req() req: Request) {
    const user = (req as any).user;
    console.info(`User ${user.sub} is fetching all URLs`);
    return this.urlService.findAll(user.sub);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string, @Req() req: Request) {
    const user = (req as any).user;
    console.info(`User ${user.sub} is fetching URL ${id}`);
    return this.urlService.findOneByCreator(+id, user.sub);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Req() req: Request) {
    const user = (req as any).user;
    console.info(`User ${user.sub} is deleting URL ${id}`);
    return this.urlService.remove(+id, user);
  }

  @UseGuards(AuthGuard)
  @Get(':id/stats')
  async getVisitStats(@Param('id') id: string) {
    const url = await this.urlService.findOne(+id);
    if (!url) {
      throw new NotFoundException('URL not found');
    }
    return this.visitService.getVisitStats(+id);
  }

  @Get(':id/visits')
  @UseGuards(AuthGuard)
  async getVisitHistory(
    @Param('id') id: string,
    @Query('limit') limit: string = '50',
    @Query('offset') offset: string = '0',
  ) {
    const url = await this.urlService.findOne(+id);
    if (!url) {
      throw new NotFoundException('URL not found');
    }
    return this.visitService.getVisitHistory(+id, +limit, +offset);
  }

  @Get('visits/all')
  @UseGuards(AuthGuard)
  async getAllVisits(
    @Query('limit') limit: string = '50',
    @Query('offset') offset: string = '0',
  ) {
    return this.visitService.getAllVisits(+limit, +offset);
  }
}
