import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Visit } from './visit.entity';

@Entity()
export class Url {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @Column({ unique: true })
    slug: string;

    @Column()
    createdBy: string;

    @Column({ default: 0 })
    visitCount: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Visit, visit => visit.url)
    visits: Visit[];
}