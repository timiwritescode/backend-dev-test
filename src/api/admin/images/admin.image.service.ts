import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ImageDto } from "src/api/image/dto/image.dto";
import { AwsService } from "src/aws/aws.service";
import { GeneralResponseDto } from "src/dto/generalResponse.dto";
import { Image } from "src/entities/image.entity";
import { User, UserRole } from "src/entities/user.entity";
import { generateFileHash } from "src/util/util";
import { Repository } from "typeorm";

@Injectable()
export class AdminImageService {
 
    constructor(
            @InjectRepository(User)
            private readonly userRepo: Repository<User>,    
    
            @InjectRepository(Image)
            private readonly imageRepo: Repository<Image>,
    
            private readonly awsService: AwsService
        ) {}


    /**
     * Service method to send image from the current logged in user to a recipient i.e admin to user
     * 
     * - Uploads image to AWS S3 bucket.
     * - Persists the uploaded image metadata in database
     * 
     * 
     * @param loggedInUserId - The admin currently logged in and sending the image.
     * @param recipientUserId- The user who will receive the image
     * @param image- Image file to be uploaded and sent
     * @returns General Response dto
     */
    async sendImageToUser(
        loggedInUserId: string, 
        recipientUserId: string,
        image: Express.Multer.File): Promise<GeneralResponseDto<ImageDto>> {
        
        const loggedInUser = await this.userRepo.findOneBy({fireBaseAuthUserId: loggedInUserId});
        const recipientUser = await this.userRepo.findOneBy({fireBaseAuthUserId: recipientUserId, role: UserRole.USER}); // Only send images to "user" role
        
        if(!loggedInUser) {
            throw new NotFoundException("User not found")
        }

        if (!recipientUser) {
            throw new NotFoundException("Recipient specified does not exist or is not a regular user")
        }
    
        if (loggedInUser == recipientUser) {
            throw new BadRequestException("You cannot send image to self")
        }


        // generate hash to ensure no images with the same buffers
        // are stored more than once
        const imageHash = generateFileHash(image.buffer);
        
        // upload file to aws, 
        const imageUrl = await this.awsService.uploadSingleFile(image, imageHash);

        // store the file in db
        const savedImage = await this.saveImageToDb(recipientUser, loggedInUser, imageUrl)
        return new GeneralResponseDto(
            true,
            "Image sent successfully",
            new ImageDto(savedImage)
        );
        
    }

    private async saveImageToDb(
        recipient: User,
        postedBy: User,
        imageUrl: string
    ): Promise<Image> {
        const newImage = this.imageRepo.create({
            imageUrl,
            recipient,
            sender: postedBy
        })

        return await this.imageRepo.save(newImage);

    }
    
}