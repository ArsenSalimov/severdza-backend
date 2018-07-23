import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {FeedItem} from './feedItem.entity';
import {Photo} from './photo';
import {Video} from './video';
import {Link} from './link';

@Entity()
export class Attachment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

    @Column('simple-json', {nullable: true})
    photo: Photo;

    @Column('simple-json', {nullable: true})
    video: Video;

    @Column('simple-json', {nullable: true})
    link: Link;

    @ManyToOne(() => FeedItem, feedItem => feedItem.attachments)
    feedItem: FeedItem;
}