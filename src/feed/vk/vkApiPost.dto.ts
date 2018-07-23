export class VkApiPostDto {
    readonly id: number;
    readonly from_id: number;
    readonly date: number;
    readonly post_type: string;
    readonly text: string;
    readonly attachments: Array<VkApiPostAttachmentDto>;
    readonly marked_as_ads: boolean;
}

export class VkApiPostAttachmentDto {
    readonly type: 'photo' | 'video';
    readonly photo: VkPhotoAttachmentDto;
    readonly video: VkApiVideoAttachmentDto;
}

export class VkPhotoAttachmentDto {
    readonly sizes: Array<VkApiPhoto>;
}

export class VkApiPhoto {
    readonly type: string;
    readonly url: string;
    readonly width: number;
    readonly height: number;
}

export class VkApiVideoAttachmentDto {
    id: number;
    owner_id: number;
    access_key: string;
    width: number;
    height: number;
}