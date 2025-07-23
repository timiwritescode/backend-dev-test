import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


export type UserDocument = User & Document;

export enum UserRole {
    USER = "user",
    AMIND = "admin"
}

@Schema({ timestamps: true })
export class User {
    @Prop()
    email: string;

    @Prop()
    fireBaseAuthUserId: string;

    
    @Prop()
    companyName: string;

    @Prop()
    numberOfProducts: number;

    @Prop({enum: UserRole, default: UserRole.USER})
    role: UserRole;

    @Prop({ type: Date })
    readonly createdAt: Date;

    @Prop({ type: Date })
    readonly updatedAt: Date;

    
}


export const UserSchema = SchemaFactory.createForClass(User);