import { BadRequestException, Controller, Get, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { Roles } from "src/decorators/role.decorator";
import { FirebaseAuthGuard } from "src/guards/firebaseAuth.guard";
import { RolesGuard } from "src/guards/roles.guard";
import { AdminUsersService } from "./admin.user.service";
import { FileInterceptor } from "@nestjs/platform-express";




@Controller("/admin/users")
export class AdminUsersController {
    constructor(private readonly service: AdminUsersService) {}

    @Get()
    @UseGuards(FirebaseAuthGuard, RolesGuard)
    @Roles(["admin"])
    async getUsers(
        @Query('page') page: number,
        @Query('pageSize') pageSize: number) {
        pageSize = !pageSize ? 10 : pageSize
        page = !page ? 1 : page

        return await this.service.getAllUsers(page, pageSize) ;
    }

    @Get(":userId")
    @UseGuards(FirebaseAuthGuard, RolesGuard)
    @Roles(["admin"])
    async getUserById(@Param("userId") userId: string) {
        return await this.service.getUserById(userId);
    }


    @Get(":userId/companies")
    @UseGuards(FirebaseAuthGuard, RolesGuard)
    @Roles(["admin"])
    async getUserCompanies(
        @Param("userId") userId: string,
        @Query('page') page: number,
        @Query('pageSize') pageSize: number) {
        pageSize = !pageSize ? 10 : pageSize
        page = !page ? 1 : page

        return await this.service.getUserCompanies(userId, page, pageSize);
    }


    @Get(":userId/companies/:companyId")
    @UseGuards(FirebaseAuthGuard, RolesGuard)
    @Roles(["admin"])
    async getUserCompanyById(
        @Param("userId") userId: string,
        @Param("companyId") companyId: string) {
        return await this.service.getUserCompanyById(userId, companyId);
    }

}