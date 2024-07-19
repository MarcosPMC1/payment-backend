import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Post()
  createTransfer(@Body() data: CreateTransferDto){
    return this.transfersService.saveTransfer(data)
  }

  @Get()
  listTransfer(){
    return this.transfersService.listTransfers()
  }
}
