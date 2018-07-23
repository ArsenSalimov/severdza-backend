import {Injectable} from '@nestjs/common';
import axios, {AxiosResponse} from 'axios';
import {VkApiWallGetResponseDto} from './VkApiWallGetResponse.dto';
import {InjectRepository} from '@nestjs/typeorm';
import {FeedItem} from '../feedItem.entity';
import {Repository} from 'typeorm';
import {Attachment} from '../attachment.entity';
import {VkApiPostDto} from './vkApiPost.dto';

@Injectable()
export class VkService {
    private readonly VK_API_URL = 'https://api.vk.com/method';
    private readonly SERVICE_KEY = '4efd21e64efd21e64efd21e6254ea26a5544efd4efd21e617014acbdb363c0d500d5114';
    private readonly PERSONAL_KEY = '67575e4f393df65ae4f5e3d79baad77d658b11d369d3a9acf67f588b19d034823d41c708b2e76656ab3ba';

    constructor(@InjectRepository(FeedItem) private readonly feedRepository: Repository<FeedItem>,
                @InjectRepository(Attachment) private readonly attachmentRepository: Repository<Attachment>) {
    }

    async syncWithVk(): Promise<void> {
        const connection = this.attachmentRepository.manager.connection;
        await connection.dropDatabase();
        await connection.synchronize();
        await this.pullFromVkGroup();
    }

    async pullFromVkGroup(): Promise<any> {
        let {count, items} = await this.getPostsFromWall();

        while (count >= items.length) {
            await this.savePosts(items);
            count -= items.length;

            ({items} = await this.getPostsFromWall());
        }
    }

    private async savePosts(items: Array<VkApiPostDto>) {
        const filteredItems = items.filter(item => !item.marked_as_ads && item.post_type === 'post');

        for (const item of filteredItems) {
            let attachments: Array<any> = [];
            let vkVideos: Array<any> = [];

            if (item.attachments !== undefined) {
                const videos = item.attachments
                    .filter(attachment => attachment.type === 'video')
                    .map(attachment => attachment.video);

                if (videos.length > 0) {
                    const tmp = await this.getVideos(videos);
                    vkVideos = tmp.data.response.items;
                }

                attachments = (await Promise.all(
                    item.attachments
                        .filter(attachment => attachment.type === 'photo' || attachment.type === 'video' || attachment.type === 'link')
                        .map((vkAttachment: any) => {
                            const attachment = new Attachment();

                            if (vkAttachment.type === 'photo') {
                                attachment.type = 'photo';
                                attachment.photo = vkAttachment.photo.sizes[vkAttachment.photo.sizes.length - 1];

                                return this.attachmentRepository.save(attachment);
                            } else if (vkAttachment.type === 'video') {
                                attachment.type = 'video';
                                const video = vkVideos.find(vkVideo => vkVideo.id === vkAttachment.video.id);
                                attachment.video = {
                                    url: video.player || video.files.external,
                                    width: vkAttachment.video.width,
                                    height: vkAttachment.video.height,
                                };

                                return this.attachmentRepository.save(attachment);
                            } else if (vkAttachment.type === 'link') {
                                attachment.type = 'link';
                                attachment.link = {
                                    url: vkAttachment.url,
                                    title: vkAttachment.title,
                                    photoUrl: vkAttachment.photo.sizes[vkAttachment.photo.sizes.length - 1],
                                };
                            }

                            return Promise.resolve(null);
                        }))).filter(a => a !== null);
            }

            const feedItem = this.feedRepository.create({
                text: item.text,
                vkId: item.id,
                date: new Date(item.date * 1000),
                attachments,
            });

            await this.feedRepository.save(feedItem);
        }
    }

    async getVideos(videoRecords: Array<any>) {
        const videos = videoRecords
            .map(videoRecord => `${videoRecord.owner_id}_${videoRecord.id}_${videoRecord.access_key}`)
            .join(',');

        return axios.get(`${this.VK_API_URL}/video.get?count=200&videos=${videos}&access_token=${this.PERSONAL_KEY}&v=5.80`);
    }

    async getPostsFromWall(offset = 0): Promise<VkApiWallGetResponseDto> {
        const url = `${this.VK_API_URL}/wall.get?count=100&offset=${offset}&domain=sevserdca&access_token=${this.SERVICE_KEY}&v=5.80`;
        const response: AxiosResponse = await axios.get(url);
        return response.data.response;
    }
}