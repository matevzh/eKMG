/* Registracija, login in validacija/generiranje JWT */

import { ConflictException, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/user.service";
import { FarmService } from "../farms/farm.service";
import { UserRegisterDto } from "./user-register.dto";
import { JwtService } from "@nestjs/jwt";
import { UserLoginDto } from "./user-login.dto";
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    /* Verbose diagnostics are kept out of production: logs there must never carry 
    secrets (JWTs) or personal data (emails). This gate only enables extra
    non-sensitive debug lines in development. */
    private readonly isProduction = process.env.NODE_ENV === 'production';

    constructor(
        private readonly userService: UsersService,
        private readonly farmService: FarmService,
        private readonly jwtService: JwtService,
    ) {}

    // Dev logger
    private debug(message: string, ...rest: unknown[]) {
        if (!this.isProduction) {
            this.logger.debug(message, ...rest);
        }
    }

    async register(userRegisterDto: UserRegisterDto) {
        try {
            /* Whether this registration created a brand-new farm or joined an existing one. Only the creator of a new farm should be sent to
            farm setup; a user joining an existing farm must never overwrite the shared farm details. */
            const existingFarm = await this.farmService.findByKmgMid(userRegisterDto.kmg_mid);
            const farm = existingFarm ?? await this.farmService.findOrCreateByKmgMid(userRegisterDto.kmg_mid);
            const isNewFarm = !existingFarm;
            const user = await this.userService.create(userRegisterDto, farm);

            // farmId is required by FarmScopeGuard on herd/calendar routes.
            // Tokens minted before this claim existed must re-login once.
            const payload = {
                email: user.email,
                sub: user.id,
                farmId: farm.id,
            };

            const token = this.jwtService.sign(payload);
            this.debug('Registered new user', user.id);

            const response = {
                data: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    farm: { id: farm.id, kmg_mid: farm.kmg_mid },
                    needsFarmSetup: isNewFarm,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                    access_token: token
                }
            };

            return response;
        } catch (error: any) {
            this.logger.error('Registration error', error?.stack ?? error?.message);

            if(error.code == '23505') { //PostgreSQL unique violation code (check if email is already in use)
                throw new ConflictException('E-pošta je že v uporabi.');
            }
            throw error;
        }
    }

    async validateUser(userLoginDto: UserLoginDto) {
        const user = await this.userService.findByEmail(userLoginDto.email);

        if(!user) {
            this.logger.warn('Login failed: user not found');
            throw new UnauthorizedException('E-pošta ni v uporabi');
        }

        const isPasswordValid = await bcrypt.compare(userLoginDto.password, user.password);

        if(!isPasswordValid) {
            this.logger.warn('Login failed: invalid password');
            throw new UnauthorizedException('Geslo je napačno');
        }

        return user;
    }

    async validateEmail(email: string) {
        
    }

    async login(userLoginDto: UserLoginDto) {
        try {
            const user = await this.validateUser(userLoginDto);
            this.debug('User validated successfully', user.id);

            if (!user.farm) {
                throw new UnauthorizedException('Uporabnik ni povezan s kmetijo.');
            }

            const payload = {
                email: user.email,
                sub: user.id,
                farmId: user.farm.id,
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
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    farm: { id: user.farm.id, kmg_mid: user.farm.kmg_mid },
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