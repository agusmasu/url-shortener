import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visit } from './entities/visit.entity';
import { Url } from './entities/url.entity';

@Injectable()
export class VisitService {
  constructor(
    @InjectRepository(Visit)
    private readonly visitRepository: Repository<Visit>,
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
  ) {}

  /**
   * Record a visit to a URL
   * @param urlId - The ID of the URL being visited
   * @param ipAddress - The IP address of the visitor
   * @param userAgent - The user agent of the visitor
   * @param referer - The referer URL
   * @returns The created visit record
   */
  async recordVisit(urlId: number, ipAddress?: string, userAgent?: string, referer?: string) {
    // Create the visit record
    const visit = this.visitRepository.create({
      urlId,
      ipAddress,
      userAgent,
      referer,
    });

    // Save the visit
    await this.visitRepository.save(visit);

    // Increment the visit count on the URL
    await this.urlRepository.increment({ id: urlId }, 'visitCount', 1);

    return visit;
  }

  /**
   * Get visit statistics for a specific URL
   * @param urlId - The ID of the URL
   * @returns Visit statistics
   */
  async getVisitStats(urlId: number) {
    const totalVisits = await this.visitRepository.count({ where: { urlId } });
    
    // Get visits in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentVisits = await this.visitRepository.count({
      where: {
        urlId,
        visitedAt: { $gte: thirtyDaysAgo } as any,
      },
    });

    // Get unique visitors (by IP) in the last 30 days
    const uniqueVisitors = await this.visitRepository
      .createQueryBuilder('visit')
      .select('COUNT(DISTINCT visit.ipAddress)', 'count')
      .where('visit.urlId = :urlId', { urlId })
      .andWhere('visit.visitedAt >= :date', { date: thirtyDaysAgo })
      .andWhere('visit.ipAddress IS NOT NULL')
      .getRawOne();

    return {
      totalVisits,
      recentVisits,
      uniqueVisitors: parseInt(uniqueVisitors?.count || '0'),
    };
  }

  /**
   * Get detailed visit history for a URL
   * @param urlId - The ID of the URL
   * @param limit - Number of visits to return
   * @param offset - Number of visits to skip
   * @returns Visit history
   */
  async getVisitHistory(urlId: number, limit: number = 50, offset: number = 0) {
    return this.visitRepository.find({
      where: { urlId },
      order: { visitedAt: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  /**
   * Get all visits with pagination
   * @param limit - Number of visits to return
   * @param offset - Number of visits to skip
   * @returns All visits
   */
  async getAllVisits(limit: number = 50, offset: number = 0) {
    return this.visitRepository.find({
      relations: ['url'],
      order: { visitedAt: 'DESC' },
      take: limit,
      skip: offset,
    });
  }
} 