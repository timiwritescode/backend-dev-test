import { Test, TestingModule } from "@nestjs/testing";
import { AdminUsersService } from "../admin.user.service"
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { mockCompanyRepositoryFind, mockCompanyRepositoryFindOneMethod, mockUserRepositoryFindMethod, mockUserRepositoryFindOneMethod } from "./util/serviceMocks";
import { GeneralResponseDto } from "src/dto/generalResponse.dto";
import { MultipleUsersDto } from "src/api/user/dto/multipleUsers.dto";
import { Company } from "src/entities/company.entity";
import { UserDto } from "src/api/user/dto/user.dto";
import { MultipleUserCompaniesDto } from "src/api/company/dto/multipleCompanies.dto";
import { CompanyDto } from "src/api/company/dto/company.dto";

describe("AdminUserService", () => {
    let adminUserService: AdminUsersService;

    const mockUserRepository = {
        find: mockUserRepositoryFindMethod,
        findOne: mockUserRepositoryFindOneMethod
    }

    const mockCompanyRepository = {
        find: mockCompanyRepositoryFind,
        findOne: mockCompanyRepositoryFindOneMethod
    }


    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AdminUsersService, {
                provide: getRepositoryToken(User),
                useValue: mockUserRepository,
            }, {
                provide: getRepositoryToken(Company),
                useValue: mockCompanyRepository
            }],
        })
        .compile();

        adminUserService = module.get<AdminUsersService>(AdminUsersService);
    })


    afterEach(() => {
    jest.clearAllMocks();
    });

    
    it("should be defined", () => {
        expect(adminUserService).toBeDefined();
    })

    it("should return GeneralResponseDto with a data field of MultipleUserDto", async() => {
        const page = 1;
        const pageSize = 10;

        const mockResponse: GeneralResponseDto<MultipleUsersDto> = {
                        success: true,
                        description: expect.any(String),
                        data: expect.objectContaining({
                            users: expect.arrayContaining([
                                expect.objectContaining({
                                    userId: expect.any(String),
                                    username: expect.any(String),
                                    email: expect.any(String),
                                    role: expect.any(String)
                                })
                            ])
                        })
                    }
        

        expect(await adminUserService.getAllUsers(page, pageSize)).toEqual(mockResponse)
        expect(mockUserRepository.find).toHaveBeenCalled();
    })


    it("should return GeneralResponseDto with a data field of user dto", async () => {
        const mockResponse: GeneralResponseDto<UserDto> = {
            success: true,
            description: expect.any(String),
            data: expect.objectContaining({
                                    userId: expect.any(String),
                                    username: expect.any(String),
                                    email: expect.any(String),
                                    role: expect.any(String)
                                })
                                
        };

        expect(await adminUserService.getUserById("mock_user_id")).toEqual(mockResponse);
        expect(mockUserRepository.findOne).toHaveBeenCalled();
    })
    

    it("should return GeneralResponseDto with a data field of Multiple user dto", async () => {
        const page = 1;
        const pageSize = 10;
        const mockResponse: GeneralResponseDto<MultipleUserCompaniesDto> = {
                        success: true,
                        description: expect.any(String),
                        data: expect.objectContaining({
                            companies: expect.arrayContaining([
                                expect.objectContaining({
                                    companyName: expect.any(String),
                                    companyId: expect.any(String),
                                    numberOfUsers: expect.any(Number),
                                    numberOfProducts: expect.any(Number),
                                    percentage: expect.any(Number),
                                    user: expect.objectContaining({
                                        email: expect.any(String),
                                        userId: expect.any(String),
                                        username: expect.any(String),
                                        role: expect.any(String)
                                    } as UserDto)
                                }as CompanyDto)
                            ])
                        })
                    }
        expect(await adminUserService.getUserCompanies("userId", page, pageSize)).toEqual(mockResponse);
        expect(mockCompanyRepository.find).toHaveBeenCalled()            
    });

    it("should return GeneralResponseDto with a data field of CompanyDto", async() => {
        const mockResponse: GeneralResponseDto<CompanyDto> = {
                success: true,
                description: expect.any(String),
                data: expect.objectContaining({
                            companyName: expect.any(String),
                            companyId: expect.any(String),
                            numberOfUsers: expect.any(Number),
                            numberOfProducts: expect.any(Number),
                            percentage: expect.any(Number),
                            user: expect.objectContaining({
                                email: expect.any(String),
                                userId: expect.any(String),
                                username: expect.any(String),
                                role: expect.any(String)
                            } as UserDto)
                        }as CompanyDto)
            }

        expect(await adminUserService.getUserCompanyById("userId", "companyId")).toEqual(mockResponse);
        expect(mockCompanyRepository.findOne).toHaveBeenCalled()
    })
})