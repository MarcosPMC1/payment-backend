import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { User } from '../auth/entities/users.entity';
import { Transfer } from './entity/transfer.entity';

@Injectable()
export class TransfersService {
    constructor(
        @InjectDataSource()
        private dataSource: DataSource,
        @InjectRepository(Transfer)
        private transfersRepository: Repository<Transfer>
    ) {}

    async saveTransfer(data: CreateTransferDto){
        return this.dataSource.transaction(async (entityManager) => {
            const userRepository = entityManager.getRepository(User)
            const transferRepository = entityManager.getRepository(Transfer)

            if(data.payee == data.payer){
                throw new BadRequestException('Cannot send value to yourself')
            }

            const payer = await userRepository.findOneBy({ id: data.payer })
            if(!payer){
                throw new BadRequestException('Payer not exists')
            }

            const payee = await userRepository.findOneBy({ id: data.payee })
            if(!payee){
                throw new BadRequestException('Payee not exists')
            }

            if(payer.balance < data.value){
                throw new BadRequestException('Payer has no balance')
            }

            payer.balance -= data.value;
            payee.balance = Number(data.value) + Number(payee.balance);

            await userRepository.save([ payee, payer ])

            return transferRepository.save(transferRepository.create(data))
        })
    }

    async listTransfers(){
        return this.transfersRepository.find()
    }
}
