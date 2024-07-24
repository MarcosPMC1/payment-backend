import { Test, TestingModule } from '@nestjs/testing';
import { TransfersService } from './transfers.service';
import { BadRequestException } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../auth/entities/users.entity'; // Adjust path as per your project
import { Transfer } from './entity/transfer.entity'; // Adjust path as per your project
import { CreateTransferDto } from './dto/create-transfer.dto';

describe('TransfersService', () => {
  let service: TransfersService;
  let userRepositoryMock: Repository<User>;
  let transferRepositoryMock: Repository<Transfer>;
  let entityManagerMock: EntityManager;

  const usersMock: User[] = [
    {
      id: '1',
      document: '89001921086',
      balance: 200,
      email: 'teste@teste.com',
      name: 'teste',
      password: '123',
      payeeTransfer: [],
      payerTransfer: []
    },
    {
      id: '2',
      document: '12345678901235',
      balance: 300,
      email: 'teste@teste.com.br',
      name: 'teste2',
      password: '123',
      payeeTransfer: [],
      payerTransfer: []
    }
  ]

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransfersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn(),
            save: jest.fn()
          },
        },
        {
          provide: getRepositoryToken(Transfer),
          useClass: Repository,
        },
        {
          provide: EntityManager,
          useValue: {
            transaction: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransfersService>(TransfersService);
    userRepositoryMock = module.get<Repository<User>>(getRepositoryToken(User));
    transferRepositoryMock = module.get<Repository<Transfer>>(getRepositoryToken(Transfer));
    entityManagerMock = module.get<EntityManager>(EntityManager);
  });

  describe('saveTransfer', () => {
    it('should success', async () => {
      const data: CreateTransferDto = {
        payer: '1',
        payee: '2',
        value: 100,
      };

      jest.spyOn(userRepositoryMock, 'findOneBy').mockResolvedValueOnce(usersMock[0]);
      jest.spyOn(userRepositoryMock, 'findOneBy').mockResolvedValueOnce(usersMock[1]);

      await expect(service.saveTransfer(data)).resolves.not.toThrow();

      expect(userRepositoryMock.findOneBy).toHaveBeenCalledTimes(2);
      expect(userRepositoryMock.findOneBy).toHaveBeenCalledWith({ id: '1'});
      expect(userRepositoryMock.findOneBy).toHaveBeenCalledWith({ id: '2'});
    });

    it('verify payee and payer equal', async () => {
      const data: CreateTransferDto = {
        payer: '1',
        payee: '1',
        value: 100,
      };

      await expect(service.saveTransfer(data)).rejects.toThrow(BadRequestException);

      expect(userRepositoryMock.save).not.toHaveBeenCalled();
    });

    it('verify payer exists', () => {
      const data: CreateTransferDto = {
        payer: '0',
        payee: '2',
        value: 100,
      };

      jest.spyOn(userRepositoryMock, 'findOneBy').mockResolvedValueOnce(null)
      expect(service.saveTransfer(data)).rejects.toThrow(BadRequestException)
    })

    it('verify payer is valid user to send', () => {
      const data: CreateTransferDto = {
        payer: '2',
        payee: '1',
        value: 100,
      };

      jest.spyOn(userRepositoryMock, 'findOneBy').mockResolvedValueOnce(usersMock[1])
      expect(service.saveTransfer(data)).rejects.toThrow(BadRequestException)
    })

    it('verify payer have balance', () => {
      const data: CreateTransferDto = {
        payer: '1',
        payee: '2',
        value: 300,
      };

      jest.spyOn(userRepositoryMock, 'findOneBy').mockResolvedValueOnce(usersMock[0])
      expect(service.saveTransfer(data)).rejects.toThrow(BadRequestException)
    })

    it('verify payee exists', () => {
      const data: CreateTransferDto = {
        payer: '1',
        payee: '0',
        value: 100,
      };

      jest.spyOn(userRepositoryMock, 'findOneBy').mockResolvedValueOnce(usersMock[0])
      jest.spyOn(userRepositoryMock, 'findOneBy').mockResolvedValueOnce(null)
      expect(service.saveTransfer(data)).rejects.toThrow(BadRequestException)
    })
  })

  describe('listTransfers', () => {
    it('should success', () => {
      jest.spyOn(transferRepositoryMock, 'find').mockResolvedValueOnce([])
      expect(service.listTransfers()).resolves.toEqual([])
      expect(transferRepositoryMock.find).toHaveBeenCalled()
    })
  })

});
