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
    DB_URI: string;
   

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

    @IsNotEmpty()
    @IsString()
    AWS_ACCESS_KEY_ID: string;

    @IsNotEmpty()
    @IsString()
    AWS_SECRET_ACCESS_KEY: string;

    @IsNotEmpty()
    @IsString()
    AWS_S3_BUCKET_NAME: string;

    @IsNotEmpty()
    @IsString()
    AWS_S3_BUCKET_REGION: string;

    @IsNotEmpty()
    @IsString()
    DB_HOST: string;

    @IsNotEmpty()
    @IsString()
    DB_PORT: string;

    @IsNotEmpty()
    @IsString()
    DB_USER: string;

    @IsNotEmpty()
    @IsString()
    DB_PASSWORD: string;

    @IsNotEmpty()
    @IsString()
    DB_NAME: string;

    @IsBase64()
    @IsNotEmpty()
    DB_CA_CERTIFICATE: string;
    
}