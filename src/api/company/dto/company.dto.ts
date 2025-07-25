import { UserDto } from "src/api/user/dto/user.dto";
import { Company } from "src/entities/company.entity";

export class CompanyDto {
    companyId: string;
    companyName: string;
    numberOfUsers: number;
    numberOfProducts: number;
    percentage: number;
    createdAt: number;
    updatedAt: number;
    user: UserDto;

    constructor(company: Company, fetchUser = true) {
        this.companyId = company.customCompanyId;
        this.companyName = company.companyName;
        this.numberOfUsers = company.numberOfUsers;
        this.numberOfProducts = company.numberOfProducts;
        this.percentage = company.percentage;
        this.createdAt = company.createdAt.getTime();
        this.updatedAt = company.createdAt.getTime();
        this.user = fetchUser ? new UserDto(company.user): null;
    }
}