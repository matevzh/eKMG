/* Registracija, login in validacija/generiranje JWT */

import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/user.service";
import { FarmService } from "../farms/farm.service";
import { UserRegisterDto } from "./user-register.dto";
import { JwtService } from "@nestjs/jwt";
import { UserLoginDto } from "./user-login.dto";
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly userService: UsersService,
        private readonly farmService: FarmService,
        private readonly jwtService: JwtService,
    ) {}

    async register(userRegisterDto: UserRegisterDto) {
        try {
            const farm = await this.farmService.findOrCreateByKmgMid(userRegisterDto.kmg_mid);
            const user = await this.userService.create(userRegisterDto, farm);

            const payload = {
                email: user.email,
                sub: user.id,
            };

            this.logger.log('Payload: ', payload);
            const token = this.jwtService.sign(payload);
            this.logger.log('Token: ', token);

            const response = {
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    farm: { id: farm.id, kmg_mid: farm.kmg_mid },
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                    access_token: token
                }
            };

            this.logger.log('Returning response: ', response);
            return response;
        } catch (error: any) {
            this.logger.error('Registration error: ', error)

            if(error.code == '2305') { //PostgreSQL unique violation code (check if email is already in use)
                throw new Error('Email already exists');
            }
            throw error;
        }
    }

    async validateUser(userLoginDto: UserLoginDto) {
        try {
            this.logger.log('Validating user: ', userLoginDto.email);
            const user = await this.userService.findByEmail(userLoginDto.email);

            if(!user) {
                this.logger.warn('User not found: ', userLoginDto.email);
                throw new UnauthorizedException('Bad login');
            }

            const isPasswordValid = await bcrypt.compare(userLoginDto.password, user.password);

            if(!isPasswordValid) {
                this.logger.warn('Invalid password for user: ', userLoginDto.email);
                throw new UnauthorizedException('Invalid password');
            }

            return user;
        } catch (error: any) {
            this.logger.error('User validation error: ', {
                error: error,
                message: error.message,
                stack: error.stack
            });
            throw error;
        }
    }

    async login(userLoginDto: UserLoginDto) {
        try {
            const user = await this.validateUser(userLoginDto);
            this.logger.log('User validated successfully: ', user.id);

            const payload = {
                email: user.email,
                sub: user.id
            };

            let token: string;
            try {
                token = this.jwtService.sign(payload);
                this.logger.log('Token created successfully');
            } catch (jwtError) {
                this.logger.error('JWT signing error: ', jwtError);
                throw new Error('Failed to create authentication token');
            }

            const response = {
                access_token: token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    farm: user.farm ? { id: user.farm.id, kmg_mid: user.farm.kmg_mid } : null,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                }
            };
            this.logger.log('Login successful, returning response');
            return response;
        } catch (error: any) {
            this.logger.error('Login error details: ', {
                error: error,
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            if(error instanceof UnauthorizedException)
                throw error;
            
            throw new Error('Internal server error during login');
        }
    } 

}