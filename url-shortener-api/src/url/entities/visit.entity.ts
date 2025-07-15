import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Url } from './url.entity';

@Entity()
export class Visit {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    urlId: number;

    @ManyToOne(() => Url, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'urlId' })
    url: Url;

    @Column({ nullable: true })
    ipAddress: string;

    @Column({ nullable: true })
    userAgent: string;

    @Column({ nullable: true })
    referer: string;

    @CreateDateColumn()
    visitedAt: Date;
} 