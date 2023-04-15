import { Entity, Column, CreateDateColumn, UpdateDateColumn, BeforeUpdate, PrimaryGeneratedColumn } from 'typeorm';

export class BaseEntity {
    
    @PrimaryGeneratedColumn("uuid")
    id:string;  

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createDateTime: Date;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updateDateTime: Date; 

    @BeforeUpdate()
    updateTimestamp(){
        this.updateDateTime = new Date();
    }
}