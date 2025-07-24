import { Injectable, NotFoundException } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from 'src/entities/user.entity';



@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) 
        private userRepo: Repository<User>) {}


    /**
     * Method creates a user object from email, uid and role and persist to database
     * 
     * 
     * @param email user email 
     * @param uid user id returned from firebase authentication operation
     * @param role user role (optional)
     * @returns User
     */
    async createUser(email:string, uid: string, role?: UserRole): Promise<UserDto> {
        const newUser = this.userRepo.create({
            email, fireBaseAuthUserId: uid, role: role
        });
        const savedUser = await this.userRepo.save(newUser)
        return new UserDto(savedUser);
    }


    public async getUserByEmail(email: string, loadCompanies = false) {
        const userInDb = await this.userRepo.findOneOrFail({
            where: {email},
            relations: {companies: loadCompanies ? true: false}
        });

        if (!userInDb) {
            throw new NotFoundException("User not found")
        }

        return userInDb
    }
}
