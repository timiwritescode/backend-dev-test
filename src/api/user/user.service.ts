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
     * Method creates a new firebase auth user and saves the return user object to application database
     * 
     * @param dto sign in request dto
     * @returns User dto
     */
    // async createUsser(dto: SignUpRequestDto): Promise<UserDto> {
    //     // create user with firebase
        
    //     const app = this.admin.setup();
    //     const newUser = await app
    //                     .auth()
    //                     .createUser({email: dto.email, password: dto.password})
            
    //     await app.auth().setCustomUserClaims(newUser.uid, {role: "USer"})

    //     // persist user to local mongo
    //     const savedUser = await this.saveUserToDb(newUser.email, newUser.uid, dto.role);
    //     return new UserDto(savedUser);
            
        
    // } 



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
