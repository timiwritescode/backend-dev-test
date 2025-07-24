import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CompanyDto } from "src/api/company/dto/company.dto";
import { MultipleUserCompaniesDto } from "src/api/company/dto/multipleCompanies.dto";
import { MultipleUsersDto } from "src/api/user/dto/multipleUsers.dto";
import { UserDto } from "src/api/user/dto/user.dto";
import { GeneralResponseDto } from "src/dto/generalResponse.dto";
import { Company } from "src/entities/company.entity";
import { User, UserRole } from "src/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class AdminUsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        @InjectRepository(Company)
        private readonly companyRepo: Repository<Company>
    ) {}
       

    /**
     * Service method to get all non-admin users in database
     * 
     * @param page Current page to read from
     * @param pageSize Number of database elements to take per page
     * @returns General Response Dto
     */
    async getAllUsers(page=1, pageSize=10): Promise<GeneralResponseDto> {
        const skip = (page - 1) * pageSize;
        const usersInDb = await this.userRepo.find({
            where: {role: UserRole.USER},
            take: pageSize,
            skip
        });
        return new GeneralResponseDto(
            true,
            "Fetched all users successfully",
            new MultipleUsersDto(usersInDb)
        )
    }


    /**
     * Service method to fetch user from db using the user ID
     * 
     * @param userId Id of User
     * @returns General response Dto
     */
    async getUserById(userId: string): Promise<GeneralResponseDto> {
        const userInDb = await this.userRepo.findOne({
            where: {fireBaseAuthUserId: userId}
        });

        if (!userInDb) {
            throw new NotFoundException("User not found");
        }

        return new GeneralResponseDto(
            true,
            "Fetched user successfully",
            new UserDto(userInDb)
        )
    }


    /**
     * Service method to enable admin view companies created or updated by a user.
     * 
     * 
     * @param userId Id of user
     * @param page Current page to read from, default 1
     * @param pageSize Number of element to take per page
     */
    async getUserCompanies(userId: string, page=1, pageSize=10): Promise<GeneralResponseDto> {
        const skip = (page - 1) * 10
        const companies = await this.companyRepo.find({
            where: {user: {fireBaseAuthUserId: userId}},
            skip,
            take: pageSize,
            relations: {user: true}
        })


        return new GeneralResponseDto(
            true,
            "Fetched user companies successfully",
            new MultipleUserCompaniesDto(companies)
        )
    }


    /**
     * Service method to enable admin view user company using user ID and the company ID
     * 
     * @param userId Id of the user
     * @param companyId Id of specific user company
     * @returns General response
     */
    async getUserCompanyById(userId: string, companyId: string): Promise<GeneralResponseDto> {
        const companyInDb = await this.companyRepo.findOne({
            where: {user: {fireBaseAuthUserId: userId}, customCompanyId: companyId},
            relations: {user: true}
        });

        if (!companyInDb) {
            throw new NotFoundException("Company not found");
        }

        return new GeneralResponseDto(
            true,
            "Fetched company successfully",
            new CompanyDto(companyInDb)
        )
    }
}