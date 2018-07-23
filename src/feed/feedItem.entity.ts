import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Attachment} from './attachment.entity';

@Entity()
export class FeedItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    vkId: number;

    @Column('longtext')
    text: string;

    @Column('datetime')
    date: Date;

    @OneToMany(() => Attachment, attachment => attachment.feedItem, {onDelete: 'CASCADE'})
    attachments: Array<Attachment>;
}