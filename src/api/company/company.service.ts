import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/entities/company.entity';
import { Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/createCompanyRequest.dto';
import { UserService } from '../user/user.service';
import { GeneralResponseDto } from 'src/dto/generalResponse.dto';
import { CompanyDto } from './dto/company.dto';
import { UpdateCompanyDto } from './dto/updateCompany.dto';
import { MultipleUserCompaniesDto } from './dto/multipleCompanies.dto';

@Injectable()
export class CompanyService {
    constructor(
        @InjectRepository(Company)
        private readonly companyRepo: Repository<Company>,

        private readonly userService: UserService
    ) {}


    /**
     * Service method to enable logged in user create a company
     * 
     * @param email User email
     * @param dto request dto
     * @returns General response dto with company information
     */
    async createCompany(email: string, dto: CreateCompanyDto): Promise<GeneralResponseDto<CompanyDto>> {
        
        const userInDb = await this.userService.getUserByEmail(email);
        if (!userInDb) {
            throw new NotFoundException("User not found")
        }
        const newCompany = this.companyRepo.create({
                companyName: dto.companyName,
                numberOfUsers: dto.numberOfUsers,
                numberOfProducts: dto.numberOfProducts,
                user: userInDb
            });
            
        const savedCompany = await this.companyRepo.save(newCompany);
            return new GeneralResponseDto(
                true,
                "Company successfully created",
                new CompanyDto(savedCompany)
            )

    }


    /**
     * Service method to fetch all companies created by logged in user from db
     * 
     * @param email User email
     * @returns General response dto with company information
     */
     async getUserCompanies(email: string, page=1, pageSize=10): Promise<GeneralResponseDto<MultipleUserCompaniesDto>> {
        const skip = (page - 1) * pageSize;
        const companies = await this.companyRepo.find({
            where: {user: {email}},
            skip,
            take: pageSize,
            relations: {user: true}
        }) 
        return new GeneralResponseDto(
            true,
            "Fetch user company details successful",
            new MultipleUserCompaniesDto(companies)
        )

    }


    /**
     * Service method to get a specific company created by user by ID
     * 
     * @param email User email
     * @param companyId 
     * @returns General response dto with fetched company details
     */
    async getUserCompanyById(email: string, companyId: string): Promise<GeneralResponseDto<CompanyDto>> {
        const companyInDb = await this.companyRepo.findOne({
            where: {user: {email}, customCompanyId: companyId},
            relations: {user: true}
        })
        if (!companyInDb) {
            throw new NotFoundException("Company not found")
        }
        return new GeneralResponseDto(
            true,
            "Successfully fetched company details",
            new CompanyDto(companyInDb)
        )
    }

    /**
     * 
     * @param email User email
     * @param companyId Company uuid issued at company creation
     * @param dto Update Company request dto with optional company fields
     * @returns General response dto with updated company info
     */
    async updateCompany(
        email: string, 
        companyId: string, 
        dto: UpdateCompanyDto): Promise<GeneralResponseDto<CompanyDto>> {
        const companyInDb = await this.companyRepo.findOne({
            where: {user: {email}, customCompanyId: companyId},
            relations: {user: true}
        });

        if (!companyInDb) {
            // all errors are handled gracefully in the global exeption filter
            throw new NotFoundException("Company not found");
        }

        if (dto.companyName) companyInDb.companyName = dto.companyName;
        if (dto.numberOfProducts) companyInDb.numberOfProducts = dto.numberOfProducts;
        if (dto.numberOfUsers) companyInDb.numberOfUsers = dto.numberOfUsers;

        const savedCompany = await this.companyRepo.save(companyInDb);

        return new GeneralResponseDto(
            true,
            "Company edited successfully",
            new CompanyDto(savedCompany)
        )
        
    }


    /**
     * Service method to enable user delete a created company of theirs
     * 
     * @param email User email
     * @param companyId company email
     */
    async deleteCompany(email: string, companyId: string) {
        const companyInDb = await this.companyRepo.findOne({
            where: {user: {email}, customCompanyId: companyId}
        });
        if (!companyInDb) {
            throw new NotFoundException("Compant not found")
        }
        await this.companyRepo.delete(companyInDb.id)
    }
}
