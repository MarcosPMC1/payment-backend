import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { User } from '../auth/entities/users.entity';
import { Transfer } from './entity/transfer.entity';

@Injectable()
export class TransfersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Transfer)
    private readonly transferRepository: Repository<Transfer>,
    private readonly entityManager: EntityManager,
  ) {}

  async saveTransfer(data: CreateTransferDto): Promise<void> {
    if (data.payee === data.payer) {
      throw new BadRequestException('Cannot send value to yourself');
    }

    const [payer, payee] = await Promise.all([
      this.userRepository.findOneBy({ id: data.payer }),
      this.userRepository.findOneBy({ id: data.payee })
    ])

    if (!payer) {
      throw new BadRequestException('Payer not exists');
    }

    if (payer.document.length === 14) {
      throw new BadRequestException('Type of user can only receive value, not send');
    }

    if (!payee) {
      throw new BadRequestException('Payee not exists');
    }

    if (payer.balance < data.value) {
      throw new BadRequestException('Payer has insufficient balance');
    }

    await this.entityManager.transaction(async entityManager => {
      payer.balance = Number(payer.balance) - Number(data.value);
      payee.balance = Number(data.value) + Number(payee.balance);
      await entityManager.save([payer, payee]);
      await entityManager.save(this.transferRepository.create(data));
    });
  }

  async listTransfers(): Promise<Transfer[]> {
    return this.transferRepository.find();
  }
}
