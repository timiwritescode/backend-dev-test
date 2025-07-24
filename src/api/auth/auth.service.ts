import { BadRequestException, ConflictException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { SignUpRequestDto } from './dtos/signUpRequest.dto';
import { GeneralResponseDto } from 'src/dto/generalResponse.dto';
import { SignInRequestDto } from './dtos/signInRequest.dto';
import { FirebaseService } from './firebase.service';
import { FirebaseAdmin } from 'src/config/firebase.config';
import { UserRole } from 'src/entities/user.entity';
import { UserDto } from '../user/dto/user.dto';

@Injectable()
export class AuthService {
    
    constructor(
        private readonly userService: UserService,
        private admin: FirebaseAdmin,
        private readonly firebaseService: FirebaseService) {}

 

    async signUpUser(dto: SignUpRequestDto): Promise<GeneralResponseDto<UserDto>> {
        try {
            const app = this.admin.getFirebaseApp();
            // create new firebase user
            const newUser = await app
                        .auth()
                        .createUser({email: dto.email, password: dto.password, displayName: dto.username});
            await app.auth().setCustomUserClaims(newUser.uid, {role: dto.role})
        
        
            // persist firebase user to  application database
            const response = await this.userService.createUser(dto.email, newUser.uid, dto.username, dto.role as UserRole);
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
                 }
                 
            const mappedError = errors[error.code];
            
            if (mappedError) return mappedError();

            // logging and error is handled in global exception filter
            throw error;
        }

    }


    async signInUser(dto: SignInRequestDto): Promise<GeneralResponseDto<{idToken: string}>> {
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
            const possibleErrorMessages = ["EMAIL_NOT_FOUND", "INVALID_PASSWORD", "INVALID_LOGIN_CREDENTIALS"]
            const code = error.response?.data?.error?.message;
            
            if (possibleErrorMessages.includes(code)) {
                throw new UnauthorizedException("Invalid login credentials")
            }

            throw error;
            
        }
    }
}
