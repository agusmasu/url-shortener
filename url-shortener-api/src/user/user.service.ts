import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login-dto';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Sign up a new user
   * @param signUpDto - The user data, containing the email and password
   * @returns The user data, along with the access token
   */
  async signUp(signUpDto: CreateUserDto) {
    // Check if the user already exists with the same email:
    const existingUser = await this.userRepository.findOneBy({ email: signUpDto.email });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    // Hash the password before saving
    const hashedPassword = this.hashPassword(signUpDto.password);
    const userToCreate = this.userRepository.create({ email: signUpDto.email, encodedPassword: hashedPassword });
    
    // Create the user:
    const user = await this.userRepository.save(userToCreate);
    
    // Generate JWT:
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);
    
    // Prepare user object for response (exclude password)
    const userResponse = {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
    return { user: userResponse, accessToken: token };
  }

  /**
   * Login a user
   * @param loginDto - The user data, containing the email and password
   * @returns The user data, along with the access token
   */
  async login(loginDto: LoginDto) {
    // Get the user by email:
    const user = await this.userRepository.findOneBy({ email: loginDto.email });
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    // Check if the password is valid:
    const isPasswordValid = bcrypt.compareSync(loginDto.password, user.encodedPassword);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    // Generate JWT
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);
    
    // Prepare user object for response (exclude password)
    const userResponse = {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
    return { user: userResponse, accessToken: token };
  }

  private hashPassword(password: string): string {
    // Use bcryptjs to hash the password
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }
  
}
