import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            Login: jest.fn(),
            Register: jest.fn()
          }
        }
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('authService should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('Login', () => {
    it('should success', () => {
      jest.spyOn(authService, 'Login').mockResolvedValueOnce({ access_token: 'token' })
      expect(controller.login({ email: 'teste@teste.com', password: '123' })).resolves.toEqual({ access_token: 'token' })
    })
  })
  
  describe('Register', () => {
    it('should success', () => {
      const user = {
        id: '1',
        name: 'teste',
        email: 'teste@teste.com',
        document: '12312312312312'
      }
      jest.spyOn(authService, 'Register').mockResolvedValueOnce(user)
      expect(controller.registrate({ password: '123', ...user })).resolves.toBe(user)
    })
  })
});
