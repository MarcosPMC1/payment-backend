import { Test, TestingModule } from '@nestjs/testing';
import { TransfersService } from './transfers.service';
import { DataSource, Repository } from 'typeorm';
import { Transfer } from './entity/transfer.entity';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';

describe('TransfersService', () => {
  let service: TransfersService;
  let transfersRepository: Repository<Transfer>;
  let dataSource: DataSource;

  const TRANSFER_REPOSITORY_TOKEN = getRepositoryToken(Transfer)
  const DATASOURCE_TOKEN = getDataSourceToken();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TRANSFER_REPOSITORY_TOKEN,
          useValue: {
            findOneBy: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: DATASOURCE_TOKEN,
          useValue: {
            transaction: jest.fn(),
          },
        },
        TransfersService
      ],
    }).compile();

    service = module.get<TransfersService>(TransfersService);
    transfersRepository = module.get<Repository<Transfer>>(TRANSFER_REPOSITORY_TOKEN)
    dataSource = module.get<DataSource>(DATASOURCE_TOKEN)
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('transfersRepository should be defined', () => {
    expect(transfersRepository).toBeDefined();
  });

  it('DataSource should be defined', () => {
    expect(dataSource).toBeDefined();
  });
});
