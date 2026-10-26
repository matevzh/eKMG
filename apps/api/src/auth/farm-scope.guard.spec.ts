import { ForbiddenException } from "@nestjs/common";
import { FarmScopeGuard } from "./farm-scope.guard";

function mockContext(user: unknown) {
    return {
        switchToHttp: () => ({
            getRequest: () => ({ user }),
        }),
    } as any;
}

describe('FarmScopeGuard', () => {
    const guard = new FarmScopeGuard();

    it('allows requests with a numeric farmId', () => {
        expect(guard.canActivate(mockContext({ userId: 1, email: 'a@b.c', farmId: 7 }))).toBe(true);
    });

    it('rejects missing farmId (stale token)', () => {
        expect(() => guard.canActivate(mockContext({ userId: 1, email: 'a@b.c' }))).toThrow(ForbiddenException);
    });

    it('rejects when user is missing', () => {
        expect(() => guard.canActivate(mockContext(undefined))).toThrow(ForbiddenException);
    });
});
