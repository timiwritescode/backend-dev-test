import { User } from "src/persistence/schemas/user.schema";

export class UserDto {
    
    email: string;
    userId: string;
    constructor(user: User) {
        this.email = user.email;
        this.userId = user.fireBaseAuthUserId;
    }
}