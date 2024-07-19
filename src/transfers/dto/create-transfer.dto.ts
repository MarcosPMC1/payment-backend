import { Type } from "class-transformer"
import { IsNumber, IsUUID } from "class-validator"

export class CreateTransferDto{
    @Type(() => Number)
    @IsNumber()
    value: number

    @IsUUID()
    payee: string

    @IsUUID()
    payer: string
}