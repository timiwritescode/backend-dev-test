import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateCompanyDto {
        @IsOptional()
        @IsString()
        companyName: string;
    
        @IsOptional()
        @IsNumber()
        numberOfUsers: number;
    
        @IsOptional()
        @IsNumber()
        numberOfProducts: number;
}