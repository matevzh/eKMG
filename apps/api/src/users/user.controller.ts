import { Controller, Get, InternalServerErrorException, Logger, NotFoundException, Request, UseGuards } from "@nestjs/common";
import { UsersService } from "./user.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller('users')
export class UsersController {
    private readonly logger = new Logger(UsersController.name);

    constructor(private readonly usersService: UsersService) {}

    @UseGuards(JwtAuthGuard)
    @Get('profile')
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
}