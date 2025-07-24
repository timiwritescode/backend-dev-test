import { User } from "src/entities/user.entity";
import { UserDto } from "./user.dto";

export class MultipleUsersDto {
    users: UserDto[]

    constructor(users: User[]) {
        this.users = users.length > 0 ?users.map(user => new UserDto(user)) : []
    }
}