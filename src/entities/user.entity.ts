import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Table, UpdateDateColumn } from "typeorm";
import { Company } from "./company.entity";
import { Image } from "./image.entity";

export enum UserRole {
    USER = "user",
    ADMIN = "admin"
}



@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false, unique: true})
    username: string;

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

    @OneToMany(() => Image, (image) => image.sender)
    imagesPosted: Image[]

    @OneToMany(() => Image, image => image.recipient)
    imagesReceived: Image[];

    @OneToMany(() => Company, (company) => company.user)
    companies: Company[];
}