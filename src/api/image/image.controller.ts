import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { Roles } from 'src/decorators/role.decorator';
import { FirebaseAuthGuard } from 'src/guards/firebaseAuth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { ImageService } from './image.service';

@Controller('images')
export class ImageController {

    constructor(private readonly service: ImageService) {}

    @Get()
    @UseGuards(FirebaseAuthGuard, RolesGuard)
    @Roles(["user"])
    async getAllReceivedImages(
        @Req() req,
        @Query('page') page: number,
        @Query('pageSize') pageSize: number) {
        pageSize = !pageSize ? 10 : pageSize
        page = !page ? 1 : page
        
        
        return await this.service.getAllRecievedImages(req.user.sub, page, pageSize)
    }


    @Get(":imageId")
    @UseGuards(FirebaseAuthGuard, RolesGuard)
    @Roles(['user'])
    async getImageById(
        @Req() req,
        @Param("imageId") imagedId: string
    ) {
        return await this.service.getReceivedImageById(req.user.sub, imagedId);
    }
}
