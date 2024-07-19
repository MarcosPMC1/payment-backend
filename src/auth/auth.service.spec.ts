import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from './entities/users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import exp from 'constants';

describe('AuthService', () => {
  let service: AuthService;
  let authRespository: Repository<User>;

  const userEntity: User = {
    id: '1',
    name: 'teste',
    document: '12345678912',
    email: 'teste@teste.com',
    password: '$2a$11$luRlInIpP2AXnSk2DCOSBOBqPDe4j1xiP09H3it2RUukE.RrXRFca'
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
            sign: jest.fn(() => 'token'),
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

  describe('Login', () => {
    it('should success', () => {
      jest.spyOn(authRespository, 'findOne').mockResolvedValueOnce(userEntity)
      expect(service.Login({ email: userEntity.email, password: 'teste123' })).resolves.toEqual({ access_token: 'token' })
      expect(authRespository.findOne).toHaveBeenCalledWith({ where: { email: userEntity.email } })
      expect(authRespository.findOne).toHaveBeenCalledTimes(1)
    })

    it('user not found', () => {
      jest.spyOn(authRespository, 'findOne').mockResolvedValueOnce(null)
      expect(service.Login({ email: userEntity.email, password: 'teste123' })).rejects.toBeInstanceOf(UnauthorizedException)
      expect(authRespository.findOne).toHaveBeenCalledWith({ where: { email: userEntity.email } })
      expect(authRespository.findOne).toHaveBeenCalledTimes(1)
    })

    it('wrong password', () => {
      jest.spyOn(authRespository, 'findOne').mockResolvedValueOnce(userEntity)
      expect(service.Login({ email: userEntity.email, password: 'teste12' })).rejects.toBeInstanceOf(UnauthorizedException)
      expect(authRespository.findOne).toHaveBeenCalledWith({ where: { email: userEntity.email } })
      expect(authRespository.findOne).toHaveBeenCalledTimes(1)
    })
  })
});
