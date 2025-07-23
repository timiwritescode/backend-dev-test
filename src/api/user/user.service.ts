import { Injectable } from '@nestjs/common';
import { FirebaseAdmin } from 'src/config/firebase.config';

import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/persistence/schemas/user.schema';
import { Model } from 'mongoose';
import { UserDto } from './dto/user.dto';



@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) 
        private userModel: Model<User>) {}


    /**
     * Method creates a user object from email, uid and role and persist to mongo database
     * 
     * 
     * @param email user email 
     * @param uid user id returned from firebase authentication operation
     * @param role user role (optional)
     * @returns User
     */
    async createUser(email:string, uid: string, role?: string): Promise<UserDto> {
        const createdUser = new this.userModel({
                                email, 
                                fireBaseAuthUserId: uid, 
                                role});
        const savedUser = await createdUser.save();
        return new UserDto(savedUser);
    }
}
