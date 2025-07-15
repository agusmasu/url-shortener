import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from './entities/url.entity';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
  ) {}

  private validateUrl(url: string): void {
    try {
      const urlObj = new URL(url);
      
      // Check if the URL has a valid protocol
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        throw new BadRequestException('Only HTTP and HTTPS protocols are allowed');
      }
      
      // Check if the URL has a valid hostname
      if (!urlObj.hostname || urlObj.hostname.length === 0) {
        throw new BadRequestException('URL must have a valid hostname');
      }
      
      // Check for common invalid hostnames
      const invalidHostnames = ['localhost', '127.0.0.1', '0.0.0.0'];
      if (invalidHostnames.includes(urlObj.hostname.toLowerCase())) {
        throw new BadRequestException('Localhost and local IP addresses are not allowed');
      }
      
      // Check if the URL is not too long (reasonable limit)
      if (url.length > 2048) {
        throw new BadRequestException('URL is too long (maximum 2048 characters)');
      }
      
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Invalid URL format');
    }
  }

  /**
   * Create a new URL
   * @param createUrlDto - The URL to create
   * @returns The created URL
   */
  async create(createUrlDto: CreateUrlDto) {
    // Validate the URL at service level
    this.validateUrl(createUrlDto.url);
    
    // Assign a random user ID
    const createdBy = `user_${Math.floor(Math.random() * 10000)}`;
    
    // Generate a unique slug with retry logic
    let slug: string;
    let attempts = 0;
    const maxAttempts = 10;
    
    do {
      slug = Math.random().toString(36).substring(2, 8);
      attempts++;
      
      // Check if slug already exists
      const existingUrl = await this.urlRepository.findOneBy({ slug });
      if (!existingUrl) {
        break;
      }
    } while (attempts < maxAttempts);
    
    if (attempts >= maxAttempts) {
      throw new ConflictException('Unable to generate unique slug after maximum attempts');
    }
    
    try {
      const url = this.urlRepository.create({
        url: createUrlDto.url,
        slug,
        createdBy,
      });
      return await this.urlRepository.save(url);
    } catch (error) {
      // Handle database-level unique constraint violations
      if (error.code === '23505' || error.message.includes('UNIQUE constraint failed')) {
        throw new ConflictException('Slug already exists. Please try again.');
      }
      throw error;
    }
  }

  /**
   * Find all URLs
   * @returns All URLs
   */
  findAll() {
    return this.urlRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Find a URL by ID
   * @param id - The ID of the URL
   * @returns The URL
   */
  findOne(id: number) {
    return this.urlRepository.findOneBy({ id });
  }

  /**
   * Find a URL by slug
   * @param slug - The slug of the URL
   * @returns The URL
   */
  findBySlug(slug: string) {
    return this.urlRepository.findOneBy({ slug });
  }

  /**
   * Update a URL
   * @param id - The ID of the URL
   * @param updateUrlDto - The URL to update
   * @returns The updated URL
   */
  async update(id: number, updateUrlDto: UpdateUrlDto) {
    // Validate the URL if it's being updated
    if (updateUrlDto.url) {
      this.validateUrl(updateUrlDto.url);
    }
    
    await this.urlRepository.update(id, updateUrlDto);
    return this.urlRepository.findOneBy({ id });
  }

  /**
   * Remove a URL
   * @param id - The ID of the URL
   * @returns The removed URL
   */
  remove(id: number) {
    return this.urlRepository.delete(id);
  }
}
