import { Body, Controller, Patch, Request } from "@nestjs/common";
import { FarmService } from "./farm.service";
import { UpdateFarmDto } from "./entities/update-farm.dto";
import { FarmScoped } from "../auth/farm-scoped.decorator";
import { AuthUserPayload } from "../auth/auth-user.payload";

@Controller('farms')
export class FarmsController {
    constructor(private readonly farmService: FarmService) {}

    @FarmScoped()
    @Patch('mine')
    async updateMine(
        @Request() req: { user: AuthUserPayload },
        @Body() updateFarmDto: UpdateFarmDto,
    ) {
        return this.farmService.update(req.user.farmId!, updateFarmDto);
    }
}
