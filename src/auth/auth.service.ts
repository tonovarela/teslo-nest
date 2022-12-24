import { Injectable, BadRequestException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { User } from './entities/user.entity';
import { CreateUserDTO, LoginUserDTO } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,private jwtService: JwtService) { }
    async create(createUserDTO: CreateUserDTO) {
        try {
            const { password, ...userData } = createUserDTO;
            const user = await this.userRepository.create({ ...userData, password: bcrypt.hashSync(password, 10) });
            await this.userRepository.save(user);
            delete user.password;
            return { ...user, token: await this.jwtService.sign({ id: user.id }) }
        } catch (error) {
            this.handleDBError(error);
        }
    }

    public checkStatus(user: User) {
        const token = this.getJWT({ id: user.id })
        delete user.isActive;
        delete user.id
        delete user.roles
        return { ...user, token };

    }

    private getJWT(payload: JwtPayload) {
        const token = this.jwtService.sign(payload);
        return token;
    }

    async login(loginUserDTO: LoginUserDTO) {
        const { password, email } = loginUserDTO;
        const user = await this.userRepository.findOne({ where: { email }, select: { email: true, password: true, id: true } });

        if (!user) {
            throw new UnauthorizedException('Emails not valid')
        }
        if (!bcrypt.compareSync(password, user.password)) {
            throw new UnauthorizedException('Password not valid')
        }
        return { ...user, token: this.getJWT({ id: user.id }) };

    }
    private handleDBError(err: any): never {
        if (err.code === "23505") {
            throw new BadRequestException(err.detail)
        }        
        throw new InternalServerErrorException('Verify server errors');
    }

}
