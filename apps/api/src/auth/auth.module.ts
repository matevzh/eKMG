import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "../users/users.module";
import { FarmsModule } from "../farms/farm.module";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { AuthController } from "./auth.controller";

@Module({
    imports: [
        UsersModule,
        FarmsModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService): Promise<JwtModuleOptions> => {
                const expiration = configService.get<string>('JWT_EXPIRATION');
                return {
                    secret: configService.get<string>('JWT_SECRET'),
                    signOptions: expiration ? { expiresIn: expiration as any } : {},
                };
            },
            inject: [ConfigService],
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService]
})

export class AuthModule {}