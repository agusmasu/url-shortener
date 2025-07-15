jest.mock('bcryptjs', () => ({
  genSaltSync: jest.fn(() => 'salt'),
  hashSync: jest.fn(() => 'hashed'),
  compareSync: jest.fn(() => true),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

const mockUserRepository = () => ({
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('UserService', () => {
  let service: UserService;
  let userRepository: any;
  let jwtService: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useFactory: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'mocked-jwt-token'),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
    jwtService = module.get(JwtService);
  });

  describe('signUp', () => {
    it('should create a new user if email does not exist', async () => {
      userRepository.findOneBy.mockResolvedValue(null);
      userRepository.create.mockReturnValue({ email: 'test@example.com', encodedPassword: 'hashed' });
      userRepository.save.mockResolvedValue({ id: 1, email: 'test@example.com', encodedPassword: 'hashed' });

      const result = await service.signUp({ email: 'test@example.com', password: 'password' });
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(userRepository.create).toHaveBeenCalledWith({ email: 'test@example.com', encodedPassword: 'hashed' });
      expect(userRepository.save).toHaveBeenCalledWith({ email: 'test@example.com', encodedPassword: 'hashed' });
      expect(result).toEqual({
        user: {
          id: 1,
          email: 'test@example.com',
          createdAt: undefined,
        },
        accessToken: 'mocked-jwt-token',
      });
    });
  });

  describe('login', () => {
    it('should throw if password is invalid', async () => {
      userRepository.findOneBy.mockResolvedValue({ email: 'test@example.com', encodedPassword: 'hashed' });
      (bcrypt.compareSync as jest.Mock).mockReturnValue(false);
      await expect(service.login({ email: 'test@example.com', password: 'wrong' })).rejects.toThrow('Invalid credentials');
    });

    it('should succeed if credentials are valid', async () => {
      userRepository.findOneBy.mockResolvedValue({ email: 'test@example.com', encodedPassword: 'hashed', id: 1 });
      (bcrypt.compareSync as jest.Mock).mockReturnValue(true);
      await expect(service.login({ email: 'test@example.com', password: 'password' })).resolves.toEqual({
        user: {
          id: 1,
          email: 'test@example.com',
          createdAt: undefined,
        },
        accessToken: 'mocked-jwt-token',
      });
    });
  });
});
