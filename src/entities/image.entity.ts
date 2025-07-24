import { BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import {v4 as uuidv4} from "uuid";
import { User } from "./user.entity";


@Entity("images")
export class Image {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({nullable: false, unique: true})
    customImageId: string;

    @Column({nullable: false})
    imageUrl: string;

    @Column({default: ""})
    caption: string

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, (user)=> user.imagesReceived, {nullable: false})
    recipient: User;

    @ManyToOne(() => User, (user) => user.imagesPosted, {nullable: false})
    sender: User;

    @BeforeInsert()
    addId() {
        this.customImageId = uuidv4();
    }
}