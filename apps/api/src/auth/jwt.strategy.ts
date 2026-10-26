import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthUserPayload } from "./auth-user.payload";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in enviroment variables');
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: { sub: number; email: string; farmId?: number }): Promise<AuthUserPayload> {
        return {
            userId: payload.sub,
            email: payload.email,
            farmId: payload.farmId,
        };
    }
}
