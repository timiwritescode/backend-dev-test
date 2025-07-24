import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from 'src/guards/firebaseAuth.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Get()
    @UseGuards(FirebaseAuthGuard)
    async getUserDetails(@Req() req) {
        return  await this.userService.getUserDetails(req.user.email)
    }

}
 