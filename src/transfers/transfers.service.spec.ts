import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { DataSource, Repository } from 'typeorm';
import { User } from '../auth/entities/users.entity'; // Adjust path as per your project
import { Transfer } from './entity/transfer.entity'; // Adjust path as per your project
import { CreateTransferDto } from './dto/create-transfer.dto';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TransfersService', () => {
  let service: TransfersService;
  let dataSourceMock: DataSource;
  let transfersRepositoryMock: Repository<Transfer>;
  let userRepositoryMock: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransfersService,
        {
          provide: DataSource,
          useValue: {
            transaction: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Transfer),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TransfersService>(TransfersService);
    dataSourceMock = module.get<DataSource>(DataSource);
    transfersRepositoryMock = module.get<Repository<Transfer>>(getRepositoryToken(Transfer));
    userRepositoryMock = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should transfer balance from payer to payee', async () => {
    const data: CreateTransferDto = {
      payer: '1',
      payee: '2',
      value: 100,
    };

    // Mock UserRepository findOne behavior
    userRepositoryMock.findOne = jest.fn().mockResolvedValueOnce({ id: '1', balance: 200 });
    userRepositoryMock.findOne = jest.fn().mockResolvedValueOnce({ id: '2', balance: 300 });

    // Mock save method of UserRepository
    userRepositoryMock.save = jest.fn().mockResolvedValueOnce({ id: '1', balance: 100 }); // Updated payer balance
    userRepositoryMock.save = jest.fn().mockResolvedValueOnce({ id: '2', balance: 400 }); // Updated payee balance

    // Mock save method of TransfersRepository
    transfersRepositoryMock.save = jest.fn().mockResolvedValueOnce({ id: '1', payer: '1', payee: '2', value: 100 });

    // Mock transaction method of DataSource to execute callback with mocked entities
    jest.spyOn(dataSourceMock, 'transaction').mockImplementation(async (callback) => {
      await callback({
        getRepository: (entity: any) => {
          if (entity === User) {
            return userRepositoryMock;
          } else if (entity === Transfer) {
            return transfersRepositoryMock;
          }
        },
      });
    });

    // Execute saveTransfer and expect no exception
    await expect(service.saveTransfer(data)).resolves.not.toThrow();

    // Verify UserRepository findOne method calls
    expect(userRepositoryMock.findOne).toHaveBeenCalledTimes(2);
    expect(userRepositoryMock.findOne).toHaveBeenCalledWith({ id: '1' });
    expect(userRepositoryMock.findOne).toHaveBeenCalledWith({ id: '2' });

    // Verify UserRepository save method calls
    expect(userRepositoryMock.save).toHaveBeenCalledTimes(2);
    expect(userRepositoryMock.save).toHaveBeenCalledWith({ id: '1', balance: 100 });
    expect(userRepositoryMock.save).toHaveBeenCalledWith({ id: '2', balance: 400 });

    // Verify TransfersRepository save method call
    expect(transfersRepositoryMock.save).toHaveBeenCalledTimes(1);
    expect(transfersRepositoryMock.save).toHaveBeenCalledWith({ payer: '1', payee: '2', value: 100 });
  });

  it('should throw BadRequestException when payer and payee are the same', async () => {
    const data: CreateTransferDto = {
      payer: '1',
      payee: '1',
      value: 100,
    };

    // Execute saveTransfer and expect BadRequestException
    await expect(service.saveTransfer(data)).rejects.toThrow(BadRequestException);

    // Verify UserRepository findOne method calls
    expect(userRepositoryMock.findOne).toHaveBeenCalledTimes(1);
    expect(userRepositoryMock.findOne).toHaveBeenCalledWith({ id: '1' });

    // Verify UserRepository save method was not called
    expect(userRepositoryMock.save).not.toHaveBeenCalled();

    // Verify TransfersRepository save method was not called
    expect(transfersRepositoryMock.save).not.toHaveBeenCalled();
  });

  // Add more test cases to cover other scenarios (e.g., user not exists, insufficient balance, etc.)
});
