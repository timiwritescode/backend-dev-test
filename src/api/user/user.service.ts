import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { SignUpRequestDto } from '../auth/dtos/signUpRequest.dto';
import { FirebaseAdmin } from 'src/config/firebase.config';
import { error } from 'console';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserRole } from 'src/persistence/schemas/user.schema';
import { Model } from 'mongoose';
import { GeneralResponseDto } from 'src/dto/generalResponse.dto';
import { UserDto } from './dto/user.dto';



@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) 
        private userModel: Model<User>,

        private admin: FirebaseAdmin) {}


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
