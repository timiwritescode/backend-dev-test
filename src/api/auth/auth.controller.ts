import { BadRequestException, Controller, Get, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
    @Get("/sign-up")
    async registerUser() {

    }


    @Post("/sign-in")
    async signInUser() {}


}
