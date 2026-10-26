import { applyDecorators, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { FarmScopeGuard } from "./farm-scope.guard";

/** JWT + farm claim — use on controllers that must be scoped to the caller's farm. */
export function FarmScoped() {
    return applyDecorators(UseGuards(JwtAuthGuard, FarmScopeGuard));
}
