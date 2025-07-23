import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Table, UpdateDateColumn } from "typeorm";

export enum UserRole {
    USER = "user",
    ADMIN = "admin"
}



@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    email: string;

    @Column({nullable: false})
    fireBaseAuthUserId: string;

    @Column({type: 'enum', enum: UserRole})
    role: UserRole;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}