import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCompanyDto {
    @IsNotEmpty()
    @IsString()
    companyName: string;

    @IsNotEmpty()
    @IsNumber()
    numberOfUsers: number;

    @IsNotEmpty()
    @IsNumber()
    numberOfProducts: number;


}