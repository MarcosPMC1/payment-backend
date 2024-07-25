import { Process, Processor } from "@nestjs/bull";
import { BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Job } from "bull";
import { User } from "src/auth/entities/users.entity";
import { Repository, EntityManager } from "typeorm";
import { Transfer } from "./entity/transfer.entity";

@Processor('transfers')
export class TransfersConsumer {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Transfer)
        private readonly transferRepository: Repository<Transfer>,
        private readonly entityManager: EntityManager
    ) { }

    @Process()
    async process(job: Job): Promise<any> {
        const data = job.data;

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
}