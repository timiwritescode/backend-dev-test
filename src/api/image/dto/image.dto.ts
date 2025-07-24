import { UserDto } from "src/api/user/dto/user.dto";
import { Image } from "src/entities/image.entity";

export class ImageDto {
    
    imageId: string;
    
    imageUrl: string;

    caption: string;

    recipient: UserDto;

    sender: UserDto;

    createdAt: number;

    updatedAt: number;

    constructor(image: Image) {
        this.imageId = image.customImageId;
        this.imageUrl = image.imageUrl;
        this.caption = image.caption;
        this.createdAt = image.createdAt.getTime();
        this.updatedAt = image.updatedAt.getTime();
        this.recipient = new UserDto(image.recipient);
        this.sender = new UserDto(image.sender);

    }
}