import { Body, Controller, HttpException, HttpStatus, Logger, Post } from "@nestjs/common";
import { UserRegisterDto } from "./user-register.dto";
import { AuthService } from "./auth.service";
import { UserLoginDto } from "./user-login.dto";

@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() userRegisterDto: UserRegisterDto) {
        try {
            const result = await this.authService.register(userRegisterDto);
            this.logger.log('Registration response: ', result);
            return result;
        } catch (error: any) {
            this.logger.error('Registration error: ',{
                error: error,
                message: error.message,
                stack: error.stack
            });

            throw new HttpException(
                error.message,
                error instanceof HttpException ? error.getStatus(): HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Post('login')
    async login(@Body() userLoginDto: UserLoginDto) {
        try {
            const result = await this.authService.login(userLoginDto);
            this.logger.log('Login response: ', result);
            return result;
        } catch (error: any) {
            this.logger.error('Login error: ', {
                error: error,
                message: error.message,
                stack: error.stack
            });
            throw new HttpException(
                error.message || 'Login failed',
                error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}