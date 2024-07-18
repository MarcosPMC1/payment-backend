import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User{
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('varchar')
    fullname: string

    @Column({ type: 'varchar', length: 14, unique: true })
    document: string

    @Column('varchar', { unique: true })
    email: string

    @Column('varchar')
    password: string
}