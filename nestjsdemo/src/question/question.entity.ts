import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Question {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    question: string;
    @Column({ type: 'text' }) // 将 answer 字段的类型设置为 text
    answer: string;


    @CreateDateColumn()
    createdtime: Date;
    @UpdateDateColumn()
    updatedtime: Date;
    // @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    // createdAt: Date;
}