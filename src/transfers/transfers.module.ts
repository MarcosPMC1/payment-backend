import { Module } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { TransfersController } from './transfers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transfer } from './entity/transfer.entity';
import { User } from 'src/auth/entities/users.entity';
import { BullModule } from '@nestjs/bull';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullAdapter } from '@bull-board/api/bullAdapter'
import { TransfersConsumer } from './transfers.consumer';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'transfers' }),
    BullBoardModule.forFeature({ name: 'transfers', adapter: BullAdapter }),
    TypeOrmModule.forFeature([Transfer, User])
  ],
  controllers: [TransfersController],
  providers: [TransfersService, TransfersConsumer],
})
export class TransfersModule {}
