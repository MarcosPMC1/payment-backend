import { Module } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { TransfersController } from './transfers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transfer } from './entity/transfer.entity';
import { User } from 'src/auth/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transfer, User])],
  controllers: [TransfersController],
  providers: [TransfersService],
})
export class TransfersModule {}
