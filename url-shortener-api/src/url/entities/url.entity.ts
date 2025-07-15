import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Visit } from './visit.entity';

@Entity()
export class Url {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false, length: 2048})
    url: string;

    @Column({ unique: true, nullable: false, length: 255})
    slug: string;

    // As of right now, we're only allowing URLs from a logged user
    // We could set this as optional, in order to allow anonymous users to create URLs
    @Column({nullable: false})
    createdBy: number;

    @Column({ default: 0, nullable: false})
    visitCount: number;

    @CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @UpdateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    updatedAt: Date;

    @OneToMany(() => Visit, visit => visit.url)
    visits: Visit[];
}