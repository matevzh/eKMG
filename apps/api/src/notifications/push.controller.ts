import { Body, Controller, HttpCode, NotFoundException, Post, Request, UseGuards } from "@nestjs/common";
import { PushService } from "./push.service";
import { RegisterPushTokenDto } from "./entities/register-push-token.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { UsersService } from "../users/user.service";

@UseGuards(JwtAuthGuard)
@Controller('push')
export class PushController {
    constructor(
        private readonly pushService: PushService,
        private readonly usersService: UsersService,
    ) {}

    private async resolveFarmId(req): Promise<number> {
        const user = await this.usersService.findById(req.user.userId);
        if (!user.farm) {
            throw new NotFoundException('User is not linked to a farm');
        }
        return user.farm.id;
    }

    @Post('register')
    @HttpCode(204)
    async register(@Body() dto: RegisterPushTokenDto, @Request() req): Promise<void> {
        const farmId = await this.resolveFarmId(req);
        await this.pushService.registerToken(req.user.userId, farmId, dto.token, dto.platform);
    }

    @Post('unregister')
    @HttpCode(204)
    async unregister(@Body() dto: RegisterPushTokenDto): Promise<void> {
        await this.pushService.removeToken(dto.token);
    }
}
