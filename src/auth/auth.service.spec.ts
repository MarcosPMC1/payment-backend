import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from './entities/users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let authRespository: Repository<User>;

  const userEntity: User = {
    id: '1',
    name: 'teste',
    document: '12345678912',
    email: 'teste@teste.com',
    password: '123'
  }

  const USER_REPOSITORY_TOKEN = getRepositoryToken(User)

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn()
          }
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(() => 'token'),
          },
        },
        AuthService
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    authRespository = module.get<Repository<User>>(USER_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('authRepository should be defined', () => {
    expect(authRespository).toBeDefined();
  });

  describe('Registrate', () => {
    it('should success', () => {
      const { password, ...user } = userEntity
      jest.spyOn(authRespository, 'save').mockResolvedValueOnce(userEntity)
      expect(service.Register(userEntity)).resolves.toEqual(user)
    })

    it('duplicated values', () => {
      jest.spyOn(authRespository, 'save').mockRejectedValueOnce({ code: '23505' })
      expect(service.Register(userEntity)).rejects.toBeInstanceOf(BadRequestException)
    })

    it('database error', () => {
      jest.spyOn(authRespository, 'save').mockRejectedValueOnce({ code: '' })
      expect(service.Register(userEntity)).rejects.toBeInstanceOf(InternalServerErrorException)
    })
  })
});
