import { Body, Controller, HttpCode, Post, Request, UseGuards } from "@nestjs/common";
import { PushService } from "./push.service";
import { RegisterPushTokenDto } from "./entities/register-push-token.dto";
import { FarmScoped } from "../auth/farm-scoped.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AuthUserPayload } from "../auth/auth-user.payload";

@Controller('push')
export class PushController {
    constructor(private readonly pushService: PushService) {}

    @FarmScoped()
    @Post('register')
    @HttpCode(204)
    async register(
        @Body() dto: RegisterPushTokenDto,
        @Request() req: { user: AuthUserPayload },
    ): Promise<void> {
        await this.pushService.registerToken(
            req.user.userId,
            req.user.farmId!,
            dto.token,
            dto.platform,
        );
    }

    // Unregister only needs a valid session; token string identifies the row.
    @UseGuards(JwtAuthGuard)
    @Post('unregister')
    @HttpCode(204)
    async unregister(@Body() dto: RegisterPushTokenDto): Promise<void> {
        await this.pushService.removeToken(dto.token);
    }
}
