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

    // Verbose diagnostics are kept out of production: logs there must never carry
    // secrets (JWTs) or personal data (emails). This gate only enables extra
    // non-sensitive debug lines in development.
    private readonly isProduction = process.env.NODE_ENV === 'production';

    constructor(
        private readonly userService: UsersService,
        private readonly farmService: FarmService,
        private readonly jwtService: JwtService,
    ) {}

    private debug(message: string, ...rest: unknown[]) {
        if (!this.isProduction) {
            this.logger.debug(message, ...rest);
        }
    }

    async register(userRegisterDto: UserRegisterDto) {
        try {
            const farm = await this.farmService.findOrCreateByKmgMid(userRegisterDto.kmg_mid);
            const user = await this.userService.create(userRegisterDto, farm);

            const payload = {
                email: user.email,
                sub: user.id,
            };

            const token = this.jwtService.sign(payload);
            this.debug('Registered new user', user.id);

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

            return response;
        } catch (error: any) {
            this.logger.error('Registration error', error?.stack ?? error?.message);

            if(error.code == '2305') { //PostgreSQL unique violation code (check if email is already in use)
                throw new Error('Email already exists');
            }
            throw error;
        }
    }

    async validateUser(userLoginDto: UserLoginDto) {
        const user = await this.userService.findByEmail(userLoginDto.email);

        if(!user) {
            this.logger.warn('Login failed: user not found');
            throw new UnauthorizedException('Bad login');
        }

        const isPasswordValid = await bcrypt.compare(userLoginDto.password, user.password);

        if(!isPasswordValid) {
            this.logger.warn('Login failed: invalid password');
            throw new UnauthorizedException('Invalid password');
        }

        return user;
    }

    async login(userLoginDto: UserLoginDto) {
        try {
            const user = await this.validateUser(userLoginDto);
            this.debug('User validated successfully', user.id);

            const payload = {
                email: user.email,
                sub: user.id
            };

            let token: string;
            try {
                token = this.jwtService.sign(payload);
            } catch (jwtError: any) {
                this.logger.error('JWT signing error', jwtError?.stack ?? jwtError?.message);
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
            this.debug('Login successful', user.id);
            return response;
        } catch (error: any) {
            if(error instanceof UnauthorizedException)
                throw error;

            this.logger.error('Login error', error?.stack ?? error?.message);
            throw new Error('Internal server error during login');
        }
    }

}