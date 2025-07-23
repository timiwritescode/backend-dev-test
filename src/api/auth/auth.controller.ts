import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { SignUpRequestDto } from './dtos/signUpRequest.dto';
import { AuthService } from './auth.service';
import { SignInRequestDto } from './dtos/signInRequest.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly service: AuthService) {}


    @Post("/sign-up")
    async registerUser(@Body() body: SignUpRequestDto) {
        return await this.service.signUpUser(body);
    }


    @Post("/sign-in")
    async signInUser(@Body() body: SignInRequestDto) {
        return await this.service.signInUser(body);
    }


}
