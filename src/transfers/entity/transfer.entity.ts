import { User } from "../../auth/entities/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('transfers')
export class Transfer{
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('uuid')
    payee: string

    @Column('uuid')
    payer: string

    @Column('numeric')
    value: number

    @ManyToOne(() => User, user => user.payeeTransfer)
    @JoinColumn({ name: 'payee' })
    payeeUser?: User

    @ManyToOne(() => User, user => user.payerTransfer)
    @JoinColumn({ name: 'payer' })
    payerUser?: User
}