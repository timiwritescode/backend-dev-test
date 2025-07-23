import { IsEnum, IsNotEmpty, IsNumberString, IsString, Matches } from "class-validator";

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
}