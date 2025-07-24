import { Image } from "src/entities/image.entity";
import { ImageDto } from "./image.dto";

export class multipleImagesDto{
    images: ImageDto[];

    constructor(images: Image[]) {
        this.images = images.length > 0 ? 
                        images.map(image => new ImageDto(image)) : 
                        [];
    }
}