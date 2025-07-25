import { BadRequestException, Body, Controller, FileTypeValidator, ParseFilePipe, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Roles } from "src/decorators/role.decorator";
import { FirebaseAuthGuard } from "src/guards/firebaseAuth.guard";
import { RolesGuard } from "src/guards/roles.guard";
import { AdminImageService } from "./admin.image.service";
import { ImageUploadRequestDto } from "./dtos/imageUpload.dto";

@Controller("admin/image")
export class AdminImageController {
    constructor(private readonly service: AdminImageService) {}

    @Post("/send")
    @UseGuards(FirebaseAuthGuard, RolesGuard)
    @Roles(["admin"])
    @UseInterceptors(FileInterceptor('image'))
    async sendImageToUser(
            @UploadedFile(
                new ParseFilePipe({
                    validators: [
                        new FileTypeValidator({fileType: '.(png|jpeg|jpg|webp)'})
                    ]
                })
            ) image: Express.Multer.File,
            @Req() req,
            @Body() dto: ImageUploadRequestDto
        ) {
            if (!image) {
                throw new BadRequestException("Image field is required")
            }
            return await this.service.sendImageToUser(req.user.sub, dto.recipientId, image)
        }
}