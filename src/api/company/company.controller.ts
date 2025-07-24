import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from 'src/guards/firebaseAuth.guard';
import { CreateCompanyDto } from './dto/createCompanyRequest.dto';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/role.decorator';
import { CompanyService } from './company.service';
import { UpdateCompanyDto } from './dto/updateCompany.dto';

@Controller('companies')
export class CompanyController {

    constructor(private readonly companyService: CompanyService) {}

    @Get()
    @UseGuards(FirebaseAuthGuard, RolesGuard)
    @Roles(["user"])
    async getAllUserCompanies(@Req() req) {
        return await this.companyService.getUserCompanies(req.user.email)
    }


    @Post()
    @UseGuards(FirebaseAuthGuard, RolesGuard)
    @Roles(["user"])
    async createCompany(
        @Req() req,
        @Body() body: CreateCompanyDto) {
            return await this.companyService.createCompany(req.user.email, body);
        }

        
    @Get("/:companyId")
    @UseGuards(FirebaseAuthGuard, RolesGuard)
    @Roles(["user"])
    async getCompanyDetailsById(
        @Param("companyId") companyId: string,
        @Req() req
    ) {
       return await this.companyService.getUserCompanyById(req.user.email, companyId) 
    }


    @Patch("/:companyId")
    @HttpCode(HttpStatus.OK)
    @UseGuards(FirebaseAuthGuard, RolesGuard)
    @Roles(["user"])
    async updateCompany(
        @Req() req,
        @Param("companyId") companyId: string,
        @Body() body: UpdateCompanyDto
        ) {
            return await this.companyService.updateCompany(req.user.email, companyId, body)
        }


    @Delete("/:companyId")
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(FirebaseAuthGuard, RolesGuard)
    @Roles(["user"])
    async deleteCompany(
        @Req() req,
        @Param("companyId") companyId: string
    ) {
        return await this.companyService.deleteCompany(req.user.email, companyId)
    }
    }
