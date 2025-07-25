import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Url } from './entities/url.entity';
import { VisitService } from './visit.service';
import { AuthGuard } from '../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('UrlController', () => {
  let controller: UrlController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [
        {
          provide: UrlService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            findBySlug: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: VisitService,
          useValue: {
            recordVisit: jest.fn(),
            getVisitStats: jest.fn(),
            getVisitHistory: jest.fn(),
            getAllVisits: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Url),
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: { verifyAsync: jest.fn() },
        },
        {
          provide: AuthGuard,
          useValue: { canActivate: jest.fn().mockResolvedValue(true) },
        },
      ],
    }).compile();

    controller = module.get<UrlController>(UrlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
