import {Controller, Get, Post, Query} from '@nestjs/common';
import {FeedItem} from './feedItem.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {VkService} from './vk/vk.service';

@Controller('api/feed')
export class FeedController {
    private readonly PAGE_SIZE = 10;

    constructor(
        @InjectRepository(FeedItem) private readonly feedRepository: Repository<FeedItem>,
        private vkService: VkService) {

    }

    @Get('/')
    public async getFeed(@Query('page') page: number): Promise<any> {
        const [items, total] = await this.feedRepository.findAndCount({
            skip: page * this.PAGE_SIZE,
            take: this.PAGE_SIZE,
            relations: ['attachments'],
        });

        return {
            total,
            items: items
                .map(feedItem => ({
                    id: feedItem.id,
                    text: feedItem.text,
                    date: feedItem.date,
                    attachments: feedItem.attachments,
                })),
        };
    }

    @Post('/sync')
    public syncWithVk(): Promise<void> {
        return this.vkService.syncWithVk();
    }

}