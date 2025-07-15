import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VisitService } from './visit.service';
import { Visit } from './entities/visit.entity';
import { Url } from './entities/url.entity';

describe('VisitService', () => {
  let service: VisitService;
  let visitRepository: Repository<Visit>;
  let urlRepository: Repository<Url>;

  const mockVisitRepository = {
    create: jest.fn(),
    save: jest.fn(),
    count: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockUrlRepository = {
    increment: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VisitService,
        {
          provide: getRepositoryToken(Visit),
          useValue: mockVisitRepository,
        },
        {
          provide: getRepositoryToken(Url),
          useValue: mockUrlRepository,
        },
      ],
    }).compile();

    service = module.get<VisitService>(VisitService);
    visitRepository = module.get<Repository<Visit>>(getRepositoryToken(Visit));
    urlRepository = module.get<Repository<Url>>(getRepositoryToken(Url));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('recordVisit', () => {
    it('should record a visit and increment visit count', async () => {
      const mockVisit = {
        id: 1,
        urlId: 1,
        ipAddress: '127.0.0.1',
        userAgent: 'test-agent',
        referer: 'test-referer',
        visitedAt: new Date(),
      };

      mockVisitRepository.create.mockReturnValue(mockVisit);
      mockVisitRepository.save.mockResolvedValue(mockVisit);
      mockUrlRepository.increment.mockResolvedValue(undefined);

      const result = await service.recordVisit(1, '127.0.0.1', 'test-agent', 'test-referer');

      expect(mockVisitRepository.create).toHaveBeenCalledWith({
        urlId: 1,
        ipAddress: '127.0.0.1',
        userAgent: 'test-agent',
        referer: 'test-referer',
      });
      expect(mockVisitRepository.save).toHaveBeenCalledWith(mockVisit);
      expect(mockUrlRepository.increment).toHaveBeenCalledWith({ id: 1 }, 'visitCount', 1);
      expect(result).toEqual(mockVisit);
    });
  });

  describe('getVisitStats', () => {
    it('should return visit statistics', async () => {
      mockVisitRepository.count.mockResolvedValue(10);
      mockVisitRepository.createQueryBuilder.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ count: '5' }),
      });

      const result = await service.getVisitStats(1);

      expect(result).toEqual({
        totalVisits: 10,
        recentVisits: 10,
        uniqueVisitors: 5,
      });
    });
  });
}); 