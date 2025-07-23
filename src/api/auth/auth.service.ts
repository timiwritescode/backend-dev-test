import { BadRequestException, ConflictException, HttpException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { SignUpRequestDto } from './dtos/signUpRequest.dto';
import { GeneralResponseDto } from 'src/dto/generalResponse.dto';
import { SignInRequestDto } from './dtos/signInRequest.dto';
import { FirebaseService } from './firebase.service';
import { FirebaseAdmin } from 'src/config/firebase.config';
import { UserRole } from 'src/entities/user.entity';

@Injectable()
export class AuthService {
    
    constructor(
        private readonly userService: UserService,
        private admin: FirebaseAdmin,
        private readonly firebaseService: FirebaseService) {}

 

    async signUpUser(dto: SignUpRequestDto): Promise<GeneralResponseDto> {
        try {
            const app = this.admin.getFirebaseApp();
            // create new firebase user
            const newUser = await app
                        .auth()
                        .createUser({email: dto.email, password: dto.password});
            await app.auth().setCustomUserClaims(newUser.uid, {role: "USer"})
        
        
            // persist firebase user to  application database
            const response = await this.userService.createUser(dto.email, newUser.uid, dto.role as UserRole);
            return new GeneralResponseDto(
                true,
                "User sign up successful",
                response
            )            
        } catch (error) {
             const errors = {
                "auth/email-already-exists": () => {throw new ConflictException("Email already exists")},
                'auth/invalid-password': () => {throw new BadRequestException('Password is too weak or invalid')},
                "auth/invalid-email": () => {throw new BadRequestException('Invalid email format')},
                "11000": () => {throw new ConflictException("Email already exists")} // user already exist in mongo  
                 }
                 
            const mappedError = errors[error.code];
            
            if (mappedError) return mappedError();

            // logging and error is handled in global exception filter
            throw error;
        }

    }


    async signInUser(dto: SignInRequestDto): Promise<GeneralResponseDto> {
        try {
            // sign in with email and password with API
            // returns a verifiable Id Token
            const {idToken} = await this.firebaseService.signInWithEmailAndPassword(dto.email, dto.password);
            return new GeneralResponseDto(
                true,
                "Sign in successful",
                {idToken}
            )
            
        } catch (error) {
            throw error
        }
    }
}
