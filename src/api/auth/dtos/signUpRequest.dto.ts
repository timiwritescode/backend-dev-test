import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsStrongPassword, Matches, NotContains } from "class-validator";
import { UserRole } from "src/entities/user.entity";

export class SignUpRequestDto {
    @IsEmail()
    @IsNotEmpty({message: "Email field cannot be empty"})
    email: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  })
    username: string;

    @IsNotEmpty()
    @IsStrongPassword({
        minLength: 8, 
        minUppercase: 1, 
        minLowercase: 1, 
        minNumbers: 1, 
        minSymbols: 1}, {message: "Password length must be at least 8 and must contain uppercase, lowerase, number and special case characters"})
    password: string;

    
    @IsOptional()
    @IsString()
    @IsEnum(UserRole)
    role?: string
}