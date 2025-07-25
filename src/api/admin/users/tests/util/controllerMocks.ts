import { CompanyDto } from "src/api/company/dto/company.dto"
import { MultipleUserCompaniesDto } from "src/api/company/dto/multipleCompanies.dto"
import { MultipleUsersDto } from "src/api/user/dto/multipleUsers.dto"
import { UserDto } from "src/api/user/dto/user.dto"
import { GeneralResponseDto } from "src/dto/generalResponse.dto"

export const mockGetAllUsers = jest.fn().mockImplementation((page, pageSize): GeneralResponseDto<MultipleUsersDto> => {
    return {
        success: true,
        description: "Successful",
        data: {
            users: [{
                email: "email_1@test.co",
                username: "user_1",
                userId: "userID_1",
                role: "user"
            }]
        }
    }
})


export const mockGetUserById = jest.fn().mockImplementation((userId): GeneralResponseDto<UserDto> => {
    return {
        success: true,
        description: "Successful",
        data: {
            email: "email_1@test.co",
            username: "test_username",
            userId: "test_userId",
            role: "user"
        }
    }
})


export const mockGetUserCompanies = jest.fn().mockImplementation((userId, page, pageSize): GeneralResponseDto<MultipleUserCompaniesDto> => {
    return {
        success: true,
        description: "Successful",
        data: {
            companies: [{
                companyName: "Mock company name",
                companyId: "Mock company ID",
                numberOfProducts: 10,
                numberOfUsers: 2000,
                percentage: 10,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                user: {
                    email: "mock@email.co",
                    userId: "mock_user_id",
                    username: "mock username",
                    role:"user"
                }
            }]
        }
    }
})


export const mockGetUserCompanyById = jest.fn().mockImplementation((userId, companyId): GeneralResponseDto<CompanyDto> => {
    return {
        success: true,
        description: "Successful",
        data: {
                companyName: "Mock company name",
                companyId: "Mock company ID",
                numberOfProducts: 10,
                numberOfUsers: 2000,
                percentage: 10,
                createdAt: 178498484,
                updatedAt: 17839984,
                user: {
                    email: "mock@email.co",
                    userId: "mock_user_id",
                    username: "mock username",
                    role:"user"
                }
            }
    }
})