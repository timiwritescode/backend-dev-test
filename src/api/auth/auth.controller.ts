import { BadRequestException, Controller, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {
    @Get()
    async registerUser() {
        throw new Error("Can't give you this endpoint at this time, thanks")
    }
}
