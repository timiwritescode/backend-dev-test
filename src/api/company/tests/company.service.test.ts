import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from '../company.service';
import { Company } from 'src/entities/company.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '../../user/user.service';
import { NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from '../dto/createCompanyRequest.dto';
import { UpdateCompanyDto } from '../dto/updateCompany.dto';
import { GeneralResponseDto } from 'src/dto/generalResponse.dto';


describe('CompanyService', () => {
    let service: CompanyService;
    
    const mockCompanyObj = {
    id: 1,
    companyName: "mock company name",
    customCompanyId: "companyID",
    numberOfUsers: 1000,
    numberOfProducts: 2,
    percentage: 1,
    user: {},
    addCompanyId: jest.fn()
}

    const mockUserService = {
        getUserByEmail: jest.fn()
    }

    const mockCompanyRepo = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        delete: jest.fn()
    }

    
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CompanyService,
                UserService,
                { 
                    provide: getRepositoryToken(Company), 
                    useValue: mockCompanyRepo },
                
            ],
        })
        .overrideProvider(UserService)
        .useValue(mockUserService)
        .compile();

        service = module.get<CompanyService>(CompanyService);

    });

    describe('createCompany', () => {
        it('should create a new company and return success response', async () => {
            const email = 'user@example.com';
            const dto: CreateCompanyDto = {
                companyName: 'Test Inc.',
                numberOfUsers: 5,
                numberOfProducts: 10
            };

            const user = { id: 1, email };
            const createdCompany = { ...dto, user };
            const savedCompany = { id: 1, ...createdCompany };

            mockUserService.getUserByEmail.mockResolvedValue(user);
            mockCompanyRepo.create.mockReturnValue(createdCompany);
            mockCompanyRepo.save.mockResolvedValue(savedCompany);

            const result = await service.createCompany(email, dto);

            expect(mockUserService.getUserByEmail).toHaveBeenCalledWith(email);
            expect(mockCompanyRepo.create).toHaveBeenCalledWith(expect.objectContaining(dto));
            expect(result).toBeInstanceOf(GeneralResponseDto);
            expect(result.success).toBe(true);
        });
    });

    describe('getUserCompanies', () => {
        it('should return companies created by user', async () => {
            const email = 'user@example.com';
            const companies = [mockCompanyObj];
            mockCompanyRepo.find.mockResolvedValue(companies);

            const result = await service.getUserCompanies(email, 1, 10);

            expect(mockCompanyRepo.find).toHaveBeenCalledWith({
                where: { user: { email } },
                skip: 0,
                take: 10,
                relations: { user: true }
            });
            expect(result.success).toBe(true);
        });
    });
    
    describe('getUserCompanyById', () => {
        it('should return a company by ID', async () => {
            const email = 'user@example.com';
            const companyId = 'mockCompanyId';
            const company = mockCompanyObj;

            mockCompanyRepo.findOne.mockResolvedValue(company);

            const result = await service.getUserCompanyById(email, companyId);

            expect(mockCompanyRepo.findOne).toHaveBeenCalledWith({
                where: { user: { email }, customCompanyId: companyId },
                relations: { user: true }
            });
            expect(result.success).toBe(true);
        });

        it('should throw if company is not found', async () => {
            mockCompanyRepo.findOne.mockResolvedValue(null);

            await expect(
                service.getUserCompanyById('test@email.com', 'id')
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('updateCompany', () => {
        it('should update and return updated company', async () => {
            const email = 'user@example.com';
            const companyId = 'uuid';
            const dto: UpdateCompanyDto = {
                companyName: 'Updated Co.',
                numberOfProducts: 2,
                numberOfUsers: 10000,
                
            };

            const company = {
                companyName: 'Old Co.',
                numberOfProducts: 20,
                numberOfUsers: 3,
                user: { email }
            };

            mockCompanyRepo.findOne.mockResolvedValue(company);
            mockCompanyRepo.save.mockResolvedValue({ ...company, ...dto });

            const result = await service.updateCompany(email, companyId, dto);

            expect(mockCompanyRepo.save).toHaveBeenCalled();
            expect(result.success).toBe(true);
        });

        it('should throw NotFoundException if company not found', async () => {
            mockCompanyRepo.findOne.mockResolvedValue(null);

            await expect(service.updateCompany('email', 'id', {})).rejects.toThrow(NotFoundException);
        });
    });

    describe('deleteCompany', () => {
        it('should delete a company successfully', async () => {
            const email = 'user@example.com';
            const companyId = 'id';
            const company = { id: 1 };

            mockCompanyRepo.findOne.mockResolvedValue(company);
            mockCompanyRepo.delete.mockResolvedValue({});

            await service.deleteCompany(email, companyId);

            expect(mockCompanyRepo.delete).toHaveBeenCalledWith(company.id);
        });

        it('should throw NotFoundException if company not found', async () => {
            mockCompanyRepo.findOne.mockResolvedValue(null);

            await expect(service.deleteCompany('email', 'id')).rejects.toThrow(NotFoundException);
        });
    });
});
