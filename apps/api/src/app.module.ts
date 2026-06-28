import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entity/user.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FarmsModule } from './farms/farm.module';
import { Farm } from './farms/entities/farm.entity';
import { Animal } from './animals/entities/animal.entity';
import { AnimalsModule } from './animals/animal.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      schema: process.env.DB_SCHEMA,
      entities: [User, Farm, Animal],
      synchronize: process.env.NODE_ENV === 'development', // Sync only in development
      dropSchema: false,
      migrationsRun: false
    }),

    UsersModule,
    AuthModule,
    FarmsModule,
    AnimalsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
