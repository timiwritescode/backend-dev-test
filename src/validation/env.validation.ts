import { IsBase64, IsEnum, IsNotEmpty, IsNumberString, IsString, Matches } from "class-validator";

export enum NodeEnvironment {
    Development = "development",
    Production = "production"
}

export class EnvironmentVariables {
    @IsEnum(NodeEnvironment)
    NODE_ENV: NodeEnvironment;

    @IsNotEmpty()
    @IsString() 
    // @Matches(/^mongodb(?:\+srv)?:\/\/[^\s@]+@[^\s@]+\/?[^\s]*$/, {message: "MONGO_URI must be a valid MONGO_URI"})
    MONGO_URI: string;
   

    @IsNumberString()
    @IsNotEmpty()
    PORT: string;

    @IsNotEmpty()
    @IsBase64()
    FIREBASE_SERVICE_ACCOUNT_B64: string;

    @IsNotEmpty()
    @IsString()
    FIREBASE_API_KEY: string;

    @IsNotEmpty()
    @IsString()
    FIREBASE_EMAIL_AND_PASSWORD_SIGNIN_URL: string;
}