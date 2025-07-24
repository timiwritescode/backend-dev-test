import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GeneralResponseDto } from 'src/dto/generalResponse.dto';
import { Image } from 'src/entities/image.entity';
import { Repository } from 'typeorm';
import { multipleImagesDto } from './dto/multipleImages.dto';
import { ImageDto } from './dto/image.dto';

@Injectable()
export class ImageService {
    constructor(
        @InjectRepository(Image)
        private readonly imageRepo: Repository<Image>
    ) {}


/**
 * Retrieves a paginated list of images received by the logged-in user.
 *
 * @param userId - The Firebase Auth User ID of the currently logged-in user.
 * @param page - The page number for pagination, starting from i.
 * @param pageSize - The number of images to return per page.
 * @returns A paginated list of images sent to the user.
 */
    async getAllRecievedImages(userId: string, page=1, pageSize=10): Promise<GeneralResponseDto<multipleImagesDto>> {
        const skip = (page - 1) * pageSize;
        const images = await this.imageRepo.find({
            where: {recipient: {fireBaseAuthUserId: userId}},
            skip,
            take: pageSize,
            order: {updatedAt: "DESC"},
            relations: {recipient: true, sender: true}
        });


        
        return new GeneralResponseDto(
            true,
            "Fetch images successful",
            new multipleImagesDto(images)
        )
    }



    /**
    * Retrieves a specific image received by the logged-in user based on the image ID.
    *
    * @param userId - The Firebase Auth User ID of the logged-in user (recipient).
    * @param imageId - The custom image ID of the image to retrieve.
    * @returns {Promise<GeneralResponseDto<ImageDto>>} A response object containing:
    *  - `success`: boolean indicating success.
    *  - `message`: a message describing the result.
    *  - `data`: an instance of `ImageDto` representing the image details.
    * 
    * @throws {NotFoundException} If the image does not exist or is not associated with the user.
    */
    async getReceivedImageById(userId: string, imageId: string): Promise<GeneralResponseDto<ImageDto>> {
        const image = await this.imageRepo.findOne({
            where: {recipient: {fireBaseAuthUserId: userId}, customImageId: imageId},
            relations: {recipient: true, sender: true}

        })

        if (!image) {
            throw new NotFoundException("Image not found")
        }

        return new GeneralResponseDto(
            true, 
            "Succcessfuly retrieved image",
            new ImageDto(image)
        )
    }
}
