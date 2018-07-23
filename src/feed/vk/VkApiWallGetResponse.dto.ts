import {VkApiPostDto} from './vkApiPost.dto';

export class VkApiWallGetResponseDto {
    readonly count: number;
    readonly items: Array<VkApiPostDto>;
}