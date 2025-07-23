import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from 'src/guards/firebaseAuth.guard';

@Controller('user')
export class UserController {

    @Get("/")
    @UseGuards(FirebaseAuthGuard)
    async getUserDetails(@Req() req) {
        return req.user
    }
}
