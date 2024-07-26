import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TransfersModule } from './transfers/transfers.module';
import { BullModule } from '@nestjs/bull';
import { FastifyAdapter } from '@bull-board/fastify';
import { BullBoardModule } from '@bull-board/nestjs';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow('POSTGRES_HOST'),
        database: configService.getOrThrow('POSTGRES_DATABASE'),
        username: configService.getOrThrow('POSTGRES_USER'),
        password: configService.getOrThrow('POSTGRES_PASSWORD'),
        port: 5432,
        autoLoadEntities: true,
        synchronize: true,
        logging: true
      })
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.getOrThrow('REDIS_HOST'),
          port: configService.getOrThrow('REDIS_PORT')
        },
        defaultJobOptions: {
          attempts: 2,
        }
      })
    }),
    BullBoardModule.forRoot({
      adapter: FastifyAdapter,
      route: '/queue'
    }),
    AuthModule,
    TransfersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
