import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ImageUploadRequestDto {

    @IsNotEmpty()
    @IsString()
    recipientId: string;

    @IsOptional()
    @IsString()
    caption?: string;
}