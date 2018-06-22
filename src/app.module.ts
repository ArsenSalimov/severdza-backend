import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AppController} from './app.controller';
import {AuthModule} from './auth/auth.module';
import {MiddlewaresConsumer} from '@nestjs/common/interfaces/middlewares';
import {CorsMiddleware} from '@nest-middlewares/cors';

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forRoot(),
    ],
    controllers: [AppController],
})

export class ApplicationModule {
    configure(consumer: MiddlewaresConsumer) {
        consumer.apply(CorsMiddleware).forRoutes('/');
    }
}