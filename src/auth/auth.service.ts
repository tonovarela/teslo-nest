import { Injectable, BadRequestException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'


import { User } from './entities/user.entity';
import { CreateUserDTO,LoginUserDTO } from './dto';



@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

    async create(createUserDTO: CreateUserDTO) {
        try {
            const { password, ...userData } = createUserDTO;
            const user = await this.userRepository.create({ ...userData, password: bcrypt.hashSync(password, 10) });
            await this.userRepository.save(user);
            delete user.password;
            return user
        } catch (error) {
            this.handleDBError(error);
        }

    }

    async login(loginUserDTO:LoginUserDTO) {

        const { password,email}= loginUserDTO;
        const user = await this.userRepository.findOne({where:{email},select:{email:true,password:true}});
        
        if (!user){
            throw new UnauthorizedException('Emails not valid')
        }
        if (!bcrypt.compareSync(password, user.password)) {
            throw new UnauthorizedException('Password not valid')
        }
        return user;
        //TODO: retorna JsonWebToken

    } 
            

    private handleDBError(err: any): never {
        if (err.code === "23505") {
            throw new BadRequestException(err.detail)

        }
        console.log(err);
        throw new InternalServerErrorException('Verify server errors');
    }


}
