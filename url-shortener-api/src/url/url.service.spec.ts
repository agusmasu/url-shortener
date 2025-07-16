import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Url } from './entities/url.entity';
import { Repository } from 'typeorm';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUrlDto } from './dto/create-url.dto';

describe('UrlService', () => {
  let service: UrlService;
  let urlRepository: Repository<Url>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: getRepositoryToken(Url),
          useValue: {
            findOneBy: jest.fn(),
            create: jest.fn((dto) => dto),
            save: jest.fn((dto) => Promise.resolve({ ...dto, id: 1 })),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: require('./visit.service').VisitService,
          useValue: {
            recordVisit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
    urlRepository = module.get<Repository<Url>>(getRepositoryToken(Url));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUrl', () => {
    it('accepts a valid URL', () => {
      expect(() => service["validateUrl"]('https://www.example.com')).not.toThrow();
    });
    it('accepts a valid URL with subroute', () => {
      expect(() => service["validateUrl"]('http://google.com/test/path?query=1')).not.toThrow();
    });
    it('rejects an invalid URL', () => {
      expect(() => service["validateUrl"]('not-a-url')).toThrow(BadRequestException);
    });
    it('rejects a URL with an invalid protocol', () => {
      expect(() => service["validateUrl"]('ftp://example.com')).toThrow(BadRequestException);
    });
    it('rejects a URL with no hostname', () => {
      expect(() => service["validateUrl"]('https:///')).toThrow(BadRequestException);
    });
    it('rejects localhost', () => {
      expect(() => service["validateUrl"]('http://localhost:3000')).toThrow(BadRequestException);
      expect(() => service["validateUrl"]('http://127.0.0.1')).toThrow(BadRequestException);
      expect(() => service["validateUrl"]('http://0.0.0.0')).toThrow(BadRequestException);
    });
    it('rejects a URL that is too long', () => {
      const longUrl = 'https://www.example.com/' + 'a'.repeat(2050);
      expect(() => service["validateUrl"](longUrl)).toThrow(BadRequestException);
    });
  });

  describe('create', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('creates a URL with a valid input', async () => {
      (urlRepository as any).findOneBy = jest.fn().mockResolvedValueOnce(null);
      const dto = { url: 'https://www.example.com' };
      const mockUser = { sub: 1, email: 'test@example.com' };
      const result = await service.create(dto as any, mockUser);
      expect(result.url).toBe(dto.url);
      expect(result.slug).toBeDefined();
    });

    it('creates a URL with a valid custom slug', async () => {
      (urlRepository as any).findOneBy = jest.fn().mockResolvedValueOnce(null);
      const dto = { url: 'https://www.example.com', slug: 'mycustomslug' };
      const mockUser = { sub: 1, email: 'test@example.com' };
      const result = await service.create(dto as any, mockUser);
      expect(result.url).toBe(dto.url);
      expect(result.slug).toBe(dto.slug);
    });

    it('throws on duplicate custom slug', async () => {
      (urlRepository as any).findOneBy = jest.fn().mockResolvedValueOnce({ slug: 'taken' } as any);
      const dto = { url: 'https://www.example.com', slug: 'taken' };
      const mockUser = { sub: 1, email: 'test@example.com' };
      await expect(service.create(dto as any, mockUser)).rejects.toThrow(ConflictException);
    });

    it('throws on invalid custom slug (bad chars)', async () => {
      const dto = { url: 'https://www.example.com', slug: 'bad slug!' };
      const mockUser = { sub: 1, email: 'test@example.com' };
      await expect(service.create(dto as any, mockUser)).rejects.toThrow(BadRequestException);
    });

    it('throws on invalid custom slug (too short)', async () => {
      const dto = { url: 'https://www.example.com', slug: 'ab' };
      const mockUser = { sub: 1, email: 'test@example.com' };
      await expect(service.create(dto as any, mockUser)).rejects.toThrow(BadRequestException);
    });
    it('throws on invalid URL', async () => {
      const mockUser = { sub: 1, email: 'test@example.com' };
      await expect(service.create({ url: 'not-a-url' } as any, mockUser)).rejects.toThrow(BadRequestException);
    });
  });

  describe('visitUrl', () => {
    it('should log an error if recordVisit fails but still return the URL', async () => {
      const url = { id: 1, url: 'https://www.example.com', slug: 'slug' };
      service.findBySlug = jest.fn().mockResolvedValue(url);
      const visitService = (service as any).visitService;
      visitService.recordVisit = jest.fn().mockRejectedValue(new Error('DB error'));
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const result = await service.visitUrl('slug', '1.2.3.4', 'agent', 'referer');
      expect(result).toBe(url);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to record visit:', expect.any(Error));
      consoleErrorSpy.mockRestore();
    });
  });
});
