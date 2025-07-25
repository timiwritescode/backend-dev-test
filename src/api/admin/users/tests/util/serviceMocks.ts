import { Company } from "src/entities/company.entity";
import { User, UserRole } from "src/entities/user.entity"
import { FindOneOptions, FindOptions } from "typeorm"


const mockUserObj = {
            id: 1,
            email: 'email@mock.co',
            username: "mock_username",
            fireBaseAuthUserId: "mock_id",
            role: UserRole.USER,
            createdAt: new Date(),
            updatedAt: new Date(),
            imagesPosted: [],
            imagesReceived: [],
            companies: []
        };

const mockComapnyObj: Company = {
    id: 1,
    companyName: "mock company name",
    customCompanyId: "companyID",
    numberOfUsers: 1000,
    numberOfProducts: 2,
    percentage: 1,
    user: mockUserObj,
    createdAt: new Date(),
    updatedAt: new Date(),
    addCompanyId: jest.fn()
}

export const mockUserRepositoryFindMethod = jest.fn().mockImplementation((options: FindOptions): User[] => {
    return [mockUserObj]
})

export const mockUserRepositoryFindOneMethod =  jest.fn().mockImplementation((options: FindOneOptions): User => {
        return mockUserObj
})


export const mockCompanyRepositoryFind = jest.fn().mockImplementation((findOption: FindOptions): Company[] => {
    return [mockComapnyObj];
})


export const mockCompanyRepositoryFindOneMethod = jest.fn().mockImplementation((findOption: FindOneOptions): Company => {
    return mockComapnyObj
})