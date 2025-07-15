import { Injectable } from '@nestjs/common';
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

  async create(createUrlDto: CreateUrlDto) {
    // Generate a short URL (simple random string for now)
    const shortUrl = Math.random().toString(36).substring(2, 8);
    // Assign a random user ID
    const createdBy = `user_${Math.floor(Math.random() * 10000)}`;
    const url = this.urlRepository.create({
      url: createUrlDto.url,
      shortUrl,
      createdBy,
    });
    return this.urlRepository.save(url);
  }

  findAll() {
    return this.urlRepository.find();
  }

  findOne(id: number) {
    return this.urlRepository.findOneBy({ id });
  }

  async update(id: number, updateUrlDto: UpdateUrlDto) {
    await this.urlRepository.update(id, updateUrlDto);
    return this.urlRepository.findOneBy({ id });
  }

  remove(id: number) {
    return this.urlRepository.delete(id);
  }
}
