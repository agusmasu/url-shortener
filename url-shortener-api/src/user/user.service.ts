import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login-dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOneBy({ email: signUpDto.email });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    // Hash the password before saving
    const hashedPassword = this.hashPassword(signUpDto.password);
    const userToCreate = this.userRepository.create({ email: signUpDto.email, encodedPassword: hashedPassword });
    return this.userRepository.save(userToCreate);
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOneBy({ email: loginDto.email });
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    const isPasswordValid = bcrypt.compareSync(loginDto.password, user.encodedPassword);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }
    // Generate JWT
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);
    return { access_token: token };
  }

  private hashPassword(password: string): string {
    // Use bcryptjs to hash the password
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }
  
}
