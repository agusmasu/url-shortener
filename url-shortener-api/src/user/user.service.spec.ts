import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

const mockUserRepository = () => ({
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn().mockReturnValue('mocked-jwt-token'),
});

describe('UserService', () => {
  let service: UserService;
  let userRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useFactory: mockUserRepository },
        { provide: JwtService, useFactory: mockJwtService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should create a new user if email does not exist', async () => {
      userRepository.findOneBy.mockResolvedValue(null);
      userRepository.create.mockReturnValue({ email: 'test@example.com', encodedPassword: 'hashed' });
      userRepository.save.mockResolvedValue({ id: 1, email: 'test@example.com', encodedPassword: 'hashed' });
      jest.spyOn(bcrypt, 'genSaltSync').mockReturnValue('salt');
      jest.spyOn(bcrypt, 'hashSync').mockReturnValue('hashed');

      const result = await service.signUp({ email: 'test@example.com', password: 'password' });
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(userRepository.create).toHaveBeenCalledWith({ email: 'test@example.com', encodedPassword: 'hashed' });
      expect(userRepository.save).toHaveBeenCalledWith({ email: 'test@example.com', encodedPassword: 'hashed' });
      expect(result).toEqual({ id: 1, email: 'test@example.com', encodedPassword: 'hashed' });
    });

    it('should throw if user already exists', async () => {
      userRepository.findOneBy.mockResolvedValue({ email: 'test@example.com' });
      await expect(service.signUp({ email: 'test@example.com', password: 'password' })).rejects.toThrow('User already exists');
    });
  });

  describe('login', () => {
    it('should throw if user does not exist', async () => {
      userRepository.findOneBy.mockResolvedValue(null);
      await expect(service.login({ email: 'notfound@example.com', password: 'password' })).rejects.toThrow('Invalid credentials');
    });

    it('should throw if password is invalid', async () => {
      userRepository.findOneBy.mockResolvedValue({ email: 'test@example.com', encodedPassword: 'hashed' });
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);
      await expect(service.login({ email: 'test@example.com', password: 'wrong' })).rejects.toThrow('Invalid credentials');
    });

    it('should succeed if credentials are valid', async () => {
      userRepository.findOneBy.mockResolvedValue({ email: 'test@example.com', encodedPassword: 'hashed', id: 1 });
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);
      await expect(service.login({ email: 'test@example.com', password: 'password' })).resolves.toEqual({ access_token: 'mocked-jwt-token' });
    });
  });
});
