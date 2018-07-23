import {Module} from '@nestjs/common';
import {FeedController} from './feed.controller';
import {VkService} from './vk/vk.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {FeedItem} from './feedItem.entity';
import {Attachment} from './attachment.entity';

@Module({
    imports: [TypeOrmModule.forFeature([FeedItem, Attachment])],
    controllers: [FeedController],
    providers: [VkService],
})
export class FeedModule {

}