/** Shape attached to `req.user` by JwtStrategy after a successful Bearer check. */
export interface AuthUserPayload {
    userId: number;
    email: string;
    /** Present on tokens issued after farm-scoped auth; required by FarmScopeGuard. */
    farmId?: number;
}
