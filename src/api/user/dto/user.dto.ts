import { User } from "src/entities/user.entity";

export class UserDto {   
    email: string;
    userId: string;
    constructor(user: User) {
        this.email = user.email;
        this.userId = user.fireBaseAuthUserId;
    }
}