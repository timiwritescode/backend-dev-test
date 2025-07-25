import { BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import {v4 as uuidv4} from "uuid"


@Entity("companies")
export class Company {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    customCompanyId: string

    @Column({nullable: false})
    companyName: string;

    @Column({nullable: false})
    numberOfUsers: number;

    @Column({nullable: false})
    numberOfProducts: number

    @ManyToOne(() => User, (user) => user.companies, {nullable: false})
    user: User;


    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
    
    get percentage(): number {
        // getter to get the percentage of user to products
        return (this.numberOfUsers / this.numberOfProducts) * 100
    }

    @BeforeInsert()
    addCompanyId() {
        this.customCompanyId = uuidv4();
    } 
    
}