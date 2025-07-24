import { User } from "src/entities/user.entity";

export class UserDto {   
    email: string;
    username: string
    userId: string;

    constructor(user: User) {
        this.email = user.email;
        this.username = user.username;
        this.userId = user.fireBaseAuthUserId;
    }
}