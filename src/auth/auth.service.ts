import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login-auth.dto';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { UserDto } from './dto/registrate-auth.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService
    ) {}

    async Login(data: LoginDto){
        const user = await this.userRepository.findOne({ where: { email: data.email } })
        if(!user || !bcrypt.compareSync(data.password, user.password)){
            throw new UnauthorizedException()
        }
        const payload = { sub: user.id, email: user.email }
        return {
            access_token: this.jwtService.sign(payload, { expiresIn: '15min', algorithm: 'RS256' })
        }
    }

    async Register(data: UserDto){
        const { password, ...user } = await this.userRepository.save(this.userRepository.create({
            ...data,
            password: bcrypt.hashSync(data.password, 11),
            balance: 10000
        }))
        .catch(err => {
            if (err.code == '23505') {
                throw new BadRequestException('User is already used');
            }
            throw new InternalServerErrorException();
        })
        return user
    }
}
