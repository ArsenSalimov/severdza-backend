import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AppController} from './app.controller';
import {MiddlewaresConsumer} from '@nestjs/common/interfaces/middlewares';
import {CorsMiddleware} from '@nest-middlewares/cors';
import {FeedModule} from './feed/feed.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(),
        FeedModule,
    ],
    controllers: [AppController],
})

export class ApplicationModule {
    configure(consumer: MiddlewaresConsumer) {
        consumer.apply(CorsMiddleware).forRoutes('/');
    }
}