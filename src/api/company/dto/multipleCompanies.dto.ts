import { UserDto } from "src/api/user/dto/user.dto";
import { CompanyDto } from "./company.dto";
import { Company } from "src/entities/company.entity";
import { User } from "src/entities/user.entity";

export class MultipleUserCompaniesDto {
    companies: CompanyDto[];
    user: UserDto

    constructor(companies: Company[], user: User) {
        this.companies = companies.length > 0 ?
                        companies.map(company => new CompanyDto(company, false)):
                        [];
        this.user = new UserDto(user)
    }
}