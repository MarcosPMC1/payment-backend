import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login-auth.dto';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService
    ) {}

    async Login(data: LoginDto){
        const user = await this.userRepository.findOne({ where: { email: data.email } })
        if(!user || bcrypt.compareSync(data.password, user.password)){
            throw new UnauthorizedException()
        }
        const payload = { sub: user.id, email: user.email }
        return {
            access_token: this.jwtService.signAsync(payload, { expiresIn: '15min', algorithm: 'RS256' })
        }
    }

    async Register(data: any){
        
    }
}
