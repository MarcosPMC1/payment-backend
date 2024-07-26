import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { Transfer } from './entity/transfer.entity';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class TransfersService {
  constructor(
    @InjectQueue('transfers')
    private transfersQueue: Queue,
    @InjectRepository(Transfer)
    private readonly transferRepository: Repository<Transfer>,
  ) {}

  async saveTransfer(data: CreateTransferDto): Promise<void> {
    if (data.payee === data.payer) {
      throw new BadRequestException('Cannot send value to yourself');
    }
    await this.transfersQueue.add(data)
    return;
  }

  async listTransfers(): Promise<Transfer[]> {
    return this.transferRepository.find();
  }
}
