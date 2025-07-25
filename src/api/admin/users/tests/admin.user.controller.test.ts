import { Test, TestingModule } from "@nestjs/testing";
import { AdminUsersController } from "../admin.user.controller"
import { AdminUsersService } from "../admin.user.service";
import { FirebaseAdmin } from "src/config/firebase.config";
import { AdminModule } from "../../admin.module";
import { FirebaseAuthGuard } from "src/guards/firebaseAuth.guard";
import { RolesGuard } from "src/guards/roles.guard";
import { mockGetAllUsers, mockGetUserById, mockGetUserCompanies, mockGetUserCompanyById } from "./util/controllerMocks";
import { MultipleUsersDto } from "src/api/user/dto/multipleUsers.dto";
import { GeneralResponseDto } from "src/dto/generalResponse.dto";
import { UserDto } from "src/api/user/dto/user.dto";
import { MultipleUserCompaniesDto } from "src/api/company/dto/multipleCompanies.dto";
import { CompanyDto } from "src/api/company/dto/company.dto";

describe("AdminUserController", () => {
    let controller: AdminUsersController;
    
    const mockAdminUserService = {
        getAllUsers: mockGetAllUsers,
        getUserById: mockGetUserById,
        getUserCompanies: mockGetUserCompanies,
        getUserCompanyById: mockGetUserCompanyById
    }

    beforeEach(async () => {
             const module: TestingModule = await Test.createTestingModule({
                 controllers: [AdminUsersController],
                 providers: [AdminUsersService]
             }).overrideProvider(AdminUsersService)
                .useValue(mockAdminUserService)
                .overrideGuard(FirebaseAuthGuard)
                .useValue({})
                .overrideGuard(RolesGuard)
                .useValue({})
                .compile();
    
             controller = module.get<AdminUsersController>(AdminUsersController);
         })

         afterEach(() => {
        jest.clearAllMocks();
        });
    
    
         it('should be defined', () => {
            expect(controller).toBeDefined();
         });

         it("should return GeneralResponseDto containing a data body of user objects", async () => {
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

            expect(await controller.getUsers(page, pageSize)).toEqual(mockResponse);
            expect(mockAdminUserService.getAllUsers).toHaveBeenCalled();
            expect(mockAdminUserService.getAllUsers).toHaveBeenCalledWith(page, pageSize)
         })


         it ("should return GeneralResponseDto with a data field containing a user object", async () => {
            const mockUserId = "mock_user_id"
            const mockResponse: GeneralResponseDto<UserDto> = {
                success: true,
                description: expect.any(String),
                data: {
                    email: expect.any(String),
                    userId: expect.any(String),
                    username: expect.any(String),
                    role: expect.any(String)
                }
            }

            expect(await controller.getUserById(mockUserId)).toEqual(mockResponse);
            expect(mockAdminUserService.getUserById).toHaveBeenCalled();
            expect(mockAdminUserService.getUserById).toHaveBeenCalledWith(mockUserId)
         })

         it ("should return GeneralResponseDto with a data body of company objects", async () => {
            const mockUserId = "mock_user_id"
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

            expect(await controller.getUserCompanies(mockUserId, page, pageSize)).toEqual(mockResponse);
            expect(mockAdminUserService.getUserCompanies).toHaveBeenCalled()
            expect(mockAdminUserService.getUserCompanies).toHaveBeenCalledWith(mockUserId, page, pageSize)

         })


        it("should return GeneralResponseDto with a data body containing a Company Object", async () => {
            const mockUserId = "mockUserId";
            const mockCompanyId = "mockCompanyId";

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
            };

            expect(await controller.getUserCompanyById(mockUserId, mockCompanyId)).toEqual(mockResponse)
            expect(mockAdminUserService.getUserCompanyById).toHaveBeenCalled()
            expect(mockAdminUserService.getUserCompanyById).toHaveBeenCalledWith(mockUserId, mockCompanyId)
  
        })
})