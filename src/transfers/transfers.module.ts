import { Module } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { TransfersController } from './transfers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transfer } from './entity/transfer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transfer])],
  controllers: [TransfersController],
  providers: [TransfersService],
})
export class TransfersModule {}
