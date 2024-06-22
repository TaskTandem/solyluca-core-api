import { Injectable, BadRequestException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';


import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';


@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository:Repository<User>,

        private readonly jwtService:JwtService
    ){}

    async createUser(createUserDto: CreateUserDto){

        try {
            const { password, ...userData } = createUserDto;

            const user = this.userRepository.create({
                ...createUserDto,
                roles: ['user','super-user','admin']
            });

            await this.userRepository.save( user );

            delete user.password;

            return {
                ...user,
                token:this.getJwtToken({ id: user.id })
            };

        } catch (error) {
            this.handleDBErrors(error);
        }

        
    }

    async loginUser(loginUserDto: LoginUserDto){
      
            const { password, email } = loginUserDto;

            const user = await this.userRepository.findOne({
                where:{
                    email
                },
                select: { password: true, id: true, email: true, fullName: true, isActive: true, roles: true }
            });

            if (!user) throw new UnauthorizedException('Creadential are not valid (email)');

            if (!bcrypt.compareSync(password, user.password)) throw new UnauthorizedException('Creadential are not valid (password)');
            
            delete user.password;

            return {
                user,
                token: this.getJwtToken({ id: user.id })
            };

    }

    async checkAuthStatus(user:User){

        return {
            ...user,
            token:this.getJwtToken({id:user.id})
        };
    }

    private getJwtToken(payload:JwtPayload){
        const token = this.jwtService.sign(payload, { expiresIn: '24h' } );
        return token;
    }

    private handleDBErrors(error): never{
        if (error.code = '23505') throw new BadRequestException(error.detail);

        console.log(error);

        throw new InternalServerErrorException('Please check server logs');
    }

}
