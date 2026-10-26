import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { AuthUserPayload } from "./auth-user.payload";

/**
 * Requires JWT auth to have already run, then ensures the token carries a farmId.
 * Does not hit the DB — farm membership is stamped at login/register.
 */
@Injectable()
export class FarmScopeGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest<{ user?: AuthUserPayload }>();
        const farmId = req.user?.farmId;

        if (farmId == null || !Number.isFinite(farmId)) {
            throw new ForbiddenException(
                'Seja nima kmetije. Prijavi se znova.',
            );
        }

        return true;
    }
}
