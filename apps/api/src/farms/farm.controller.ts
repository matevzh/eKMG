import { Body, Controller, NotFoundException, Patch, Request, UseGuards } from "@nestjs/common";
import { FarmService } from "./farm.service";
import { UsersService } from "../users/user.service";
import { UpdateFarmDto } from "./entities/update-farm.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller('farms')
export class FarmsController {
    constructor(
        private readonly farmService: FarmService,
        private readonly usersService: UsersService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Patch('mine')
    async updateMine(@Request() req, @Body() updateFarmDto: UpdateFarmDto) {
        const user = await this.usersService.findById(req.user.userId);
        if (!user.farm) {
            throw new NotFoundException('User is not linked to a farm');
        }
        return this.farmService.update(user.farm.id, updateFarmDto);
    }
}
