import { Transfer } from "../../transfers/entity/transfer.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User{
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('varchar')
    name: string

    @Column({ type: 'varchar', length: 14, unique: true })
    document: string

    @Column('varchar', { unique: true })
    email: string

    @Column('varchar')
    password: string

    @Column('numeric')
    balance: number

    @OneToMany(() => Transfer, transfer => transfer.payeeUser)
    payeeTransfer: Transfer[]

    @OneToMany(() => Transfer, transfer => transfer.payerUser)
    payerTransfer: Transfer[]
}