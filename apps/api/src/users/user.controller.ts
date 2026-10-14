import { Controller, Delete, Get, HttpCode, InternalServerErrorException, Logger, NotFoundException, Request, UseGuards, Patch, Body } from "@nestjs/common";
import { UsersService } from "./user.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { UpdateUserDto } from "./entity/update-user.dto";

@Controller('users')
export class UsersController {
    private readonly logger = new Logger(UsersController.name);

    constructor(private readonly usersService: UsersService) {}

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getProfile(@Request() req) {
        try {
            if(!req.user?.userId) {
                this.logger.error('No user ID found in request');
                throw new NotFoundException('User ID not found in request');
            }

            this.logger.log('Fetching profile for user', req.user.userId);
            const user = await this.usersService.findById(req.user.userId);

            if(!user) {
                this.logger.error('User not found');
                throw new Error('User not found');
            }

            // Remove sensitive data
            const { password, ...result } = user;
            this.logger.log('Profile fetched succesfully');
            return result;

        } catch (error) {
            this.logger.error('Error fetching profile: ', error);

            if(error instanceof NotFoundException) 
                throw error;

            throw new InternalServerErrorException('Error fetching user profile');
        }
    }

    // GDPR Art. 15/20 — let the user download all personal data we hold on them.
    @UseGuards(JwtAuthGuard)
    @Get('me/export')
    async exportData(@Request() req) {
        if (!req.user?.userId) {
            throw new NotFoundException('User ID not found in request');
        }
        return this.usersService.exportData(req.user.userId);
    }

    // GDPR Art. 17 — hard-delete the user's account and personal data.
    @UseGuards(JwtAuthGuard)
    @Delete('me')
    @HttpCode(204)
    async deleteAccount(@Request() req) {
        if (!req.user?.userId) {
            throw new NotFoundException('User ID not found in request');
        }
        await this.usersService.deleteAccount(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('me')
    async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
        if (!req.user?.userId) {
            throw new NotFoundException('User ID not found in request');
        }
        return this.usersService.updateUser(req.user.userId, updateUserDto);
    }
}