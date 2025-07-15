import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Url } from './url.entity';

@Entity()
export class Visit {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    urlId: number;

    @ManyToOne(() => Url, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'urlId' })
    url: Url;

    @Column({ nullable: true, length: 45})
    ipAddress: string;

    @Column({ nullable: true, length: 255})
    userAgent: string;

    @Column({ nullable: true, length: 2048})
    referer: string;

    @CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    visitedAt: Date;
} 